import{store,setStep}from"../store.js";
import{validateRows,TEMPLATE_COLUMNS}from"../modules/validator.js";
import{todayIso}from"../util/date-utils.js";

const KEEP_FIELD_VALUE="__KEEP_FIELD__";
let processedRows=[];
let validation={errors:[],warnings:[]};
let visibleRows=[];
let visibleColumns=[];
let trackedRowIds=[];
let trackingSignature="";

const ALWAYS_VISIBLE_COLUMNS=[
  "Email Address",
  "Last Response Date",
  "First Name",
  "Last Name",
  "Company Name",
  "Country",
  "Product",
  "SFDC Campaign ID",
  "Lead Owner ID"
];

function escapeHtml(value){
  return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
}

function keyPart(value){
  return String(value??"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

function settingValue(state,column){
  if(state.settings?.[column]===true)return"Yes";
  if(state.settings?.[column]===false)return"";
  if(state.settings?.[column]!=null&&state.settings[column]!=="")return state.settings[column];
  if(column==="Last Response Date")return todayIso();
  return"";
}

function deletedRowIds(state){
  return new Set(state.deletedRowIds||[]);
}

function makeTrackingSignature(state){
  return state.files.map(file=>`${file.id}:${file.rows.length}`).join("|");
}

export function buildRows(state){
  const rows=[];
  const deleted=deletedRowIds(state);
  for(const file of state.files){
    const maps=state.mappings[file.id]||{};
    for(let sourceIndex=0;sourceIndex<file.rows.length;sourceIndex++){
      const rowId=`${file.id}:${sourceIndex}`;
      if(deleted.has(rowId))continue;
      const sourceRow=file.rows[sourceIndex];
      const outputRow={};
      for(const column of TEMPLATE_COLUMNS){
        outputRow[column]=settingValue(state,column);
      }
      for(const [sourceColumn,mapping]of Object.entries(maps)){
        if(mapping?.mappedTo===KEEP_FIELD_VALUE){
          outputRow[sourceColumn]=sourceRow[sourceColumn]??"";
        }else if(mapping?.mappedTo){
          outputRow[mapping.mappedTo]=sourceRow[sourceColumn]??outputRow[mapping.mappedTo];
        }
      }
      outputRow.__sourceFile=file.name;
      outputRow.__sourceRowNumber=sourceIndex+1;
      outputRow.__rowId=rowId;
      rows.push(outputRow);
    }
  }
  return rows;
}

function rowIndexById(rowId){
  return processedRows.findIndex(row=>row.__rowId===rowId);
}

function issuesForRow(rowIndex){
  const errors=validation.errors.filter(issue=>issue.rowIndex===rowIndex);
  const warnings=validation.warnings.filter(issue=>issue.rowIndex===rowIndex);
  return{errors,warnings,all:[...errors,...warnings]};
}

function currentIssueRowIds(){
  return processedRows.map((row,rowIndex)=>({row,rowIndex,issues:issuesForRow(rowIndex)})).filter(item=>item.issues.all.length>0).map(item=>item.row.__rowId);
}

function issueTypeCounts(errors){
  return errors.reduce((acc,error)=>{
    acc[error.type]=(acc[error.type]||0)+1;
    return acc;
  },{});
}

function extraColumns(){
  const extras=[];
  const base=new Set(TEMPLATE_COLUMNS);
  for(const row of processedRows){
    for(const column of Object.keys(row)){
      if(column.startsWith("__"))continue;
      if(base.has(column))continue;
      if(!extras.includes(column))extras.push(column);
    }
  }
  return extras;
}

function computeVisibleColumns(){
  const issueColumns=[...validation.errors,...validation.warnings].map(issue=>issue.column).filter(Boolean);
  const ordered=["Email Address",...issueColumns.filter(column=>column!=="Email Address"),...ALWAYS_VISIBLE_COLUMNS.filter(column=>column!=="Email Address"),...extraColumns()];
  return [...new Set(ordered)].filter(column=>TEMPLATE_COLUMNS.includes(column)||extraColumns().includes(column));
}

function issueSummaryForCell(rowIndex,column){
  const errors=validation.errors.filter(issue=>issue.rowIndex===rowIndex&&issue.column===column);
  const warnings=validation.warnings.filter(issue=>issue.rowIndex===rowIndex&&issue.column===column);
  const all=[...errors,...warnings];
  if(!all.length)return"";
  return all.map(issue=>{
    const prefix=errors.includes(issue)?"Error":"Warning";
    const country=issue.country?` (${issue.country})`:"";
    return `${prefix}: ${issue.type}${country}`;
  }).join("; ");
}

function renderInlineStyles(){
  return `<style id="step5-delete-row-and-keep-fields-css">
    .review-delete-row{margin-top:10px;min-height:37px;font-size:13px;padding:0 14px}.row-deleted{opacity:.6}.kept-field-heading::after{content:" kept";display:inline-flex;margin-left:6px;padding:2px 8px;border-radius:20px;background:var(--color-info-light,var(--bg-sky));color:var(--color-secondary,var(--progress-blue));font-size:11px;text-transform:uppercase;letter-spacing:.06em}
  </style>`;
}

function renderIssuePanel(){
  const activeIssueCount=currentIssueRowIds().length;
  const resolvedCount=trackedRowIds.length-activeIssueCount;
  if(!trackedRowIds.length){
    return `<div class="card review-ok-card"><h2>No validation issues found.</h2><p>Your file is ready to export. Click Continue to move to Export.</p></div>`;
  }
  return `<div class="review-issue-panel"><div><strong>Rows that had issues stay visible</strong><p>${activeIssueCount} row(s) still need attention. ${resolvedCount} row(s) have been resolved and are shown in green. Use Delete Row to exclude an unwanted record from validation and export.</p></div><div class="review-issue-legend"><span class="legend-error">Error</span><span class="legend-warning">Warning</span><span class="legend-resolved">Resolved</span></div></div>`;
}

function renderIssueTable(){
  if(!visibleRows.length)return"";
  return `<div class="review-table-frame" tabindex="0" aria-label="Tracked validation rows. Rows turn green when resolved."><table class="review-table review-issues-only"><thead><tr><th class="issue-sticky-col">Issue</th><th>Source</th>${visibleColumns.map(column=>`<th class="${TEMPLATE_COLUMNS.includes(column)?"":"kept-field-heading"}">${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${visibleRows.map(({row,rowIndex})=>renderTrackedRow(row,rowIndex)).join("")}</tbody></table></div>`;
}

function renderTrackedRow(row,rowIndex){
  const issues=issuesForRow(rowIndex);
  const rowClass=issues.errors.length?"row-error":issues.warnings.length?"row-warning":"row-resolved";
  const issueMarkup=issues.all.length
    ? `<ul>${issues.all.map(issue=>`<li class="${issues.errors.includes(issue)?"issue-error-text":"issue-warning-text"}">${escapeHtml(issue.type)}${issue.column?`<br><span>${escapeHtml(issue.column)}</span>`:""}${issue.country?`<br><span>Country: ${escapeHtml(issue.country)}</span>`:""}</li>`).join("")}</ul>`
    : `<ul><li class="issue-resolved-text">Resolved<br><span>This row is now valid.</span></li></ul>`;
  const deleteButton=`<button type="button" class="btn btn-tertiary review-delete-row" data-delete-row-id="${escapeHtml(row.__rowId)}">Delete Row</button>`;
  return `<tr class="${rowClass}"><td class="issue-sticky-col issue-cell"><strong>Row ${rowIndex+1}</strong>${issueMarkup}${deleteButton}</td><td><span>${escapeHtml(row.__sourceFile||"")}</span><br><small>Source row ${escapeHtml(row.__sourceRowNumber||rowIndex+1)}</small></td>${visibleColumns.map(column=>renderEditableCell(row,column,rowIndex)).join("")}</tr>`;
}

function renderEditableCell(row,column,rowIndex){
  const note=issueSummaryForCell(rowIndex,column);
  const hasIssue=Boolean(note);
  const id=`review-issue-${rowIndex+1}-${keyPart(column)}`;
  return `<td class="${hasIssue?"cell-has-issue":""}"><input id="${id}" class="input review-input" data-r="${rowIndex}" data-c="${escapeHtml(column)}" value="${escapeHtml(row[column])}" title="${escapeHtml(note)}">${hasIssue?`<small class="cell-issue-note">${escapeHtml(note)}</small>`:""}</td>`;
}

function recomputeAndPublish(){
  validation=validateRows(processedRows);
  const activeRows=currentIssueRowIds();
  trackedRowIds=[...new Set([...trackedRowIds,...activeRows])].filter(rowId=>rowIndexById(rowId)>-1);
  visibleRows=trackedRowIds.map(rowId=>({row:processedRows[rowIndexById(rowId)],rowIndex:rowIndexById(rowId)})).filter(item=>item.row);
  visibleColumns=computeVisibleColumns();
  store.set({processedRows,validation},{reviewEdit:true});
}

function deleteRow(rowId){
  const deleted=[...new Set([...(store.get().deletedRowIds||[]),rowId])];
  trackedRowIds=trackedRowIds.filter(id=>id!==rowId);
  processedRows=buildRows({...store.get(),deletedRowIds:deleted});
  validation=validateRows(processedRows);
  visibleRows=trackedRowIds.map(id=>({row:processedRows[rowIndexById(id)],rowIndex:rowIndexById(id)})).filter(item=>item.row);
  visibleColumns=computeVisibleColumns();
  store.set({deletedRowIds:deleted,processedRows,validation},{reviewEdit:true});
}

export function render(){
  const state=store.get();
  const signature=makeTrackingSignature(state);
  processedRows=state.processedRows?.length?state.processedRows:buildRows(state);
  validation=validateRows(processedRows);
  const activeRows=currentIssueRowIds();

  if(signature!==trackingSignature){
    trackingSignature=signature;
    trackedRowIds=activeRows;
  }else{
    trackedRowIds=[...new Set([...trackedRowIds,...activeRows])].filter(rowId=>rowIndexById(rowId)>-1);
  }

  visibleRows=trackedRowIds.map(rowId=>({row:processedRows[rowIndexById(rowId)],rowIndex:rowIndexById(rowId)})).filter(item=>item.row);
  visibleColumns=computeVisibleColumns();

  state.processedRows=processedRows;
  state.validation=validation;

  return `${renderInlineStyles()}<section><h1 class="step-title">Review Your Data</h1><p class="step-subtitle">Rows that had issues remain visible; resolved rows turn green. Email Address is the first data column. Delete Row removes that record from validation and export.</p><div class="summary-cards"><div class="summary-card"><span>Total Rows</span><strong>${processedRows.length}</strong></div><div class="summary-card"><span>Tracked Rows</span><strong>${trackedRowIds.length}</strong></div><div class="summary-card"><span>Errors</span><strong>${validation.errors.length}</strong></div><div class="summary-card"><span>Warnings</span><strong>${validation.warnings.length}</strong></div></div>${renderIssuePanel()}${renderIssueTable()}</section>`;
}

export function bind(){
  document.querySelectorAll("[data-r][data-c]").forEach(input=>{
    input.addEventListener("change",()=>{
      const rowIndex=Number(input.dataset.r);
      const column=input.dataset.c;
      processedRows[rowIndex][column]=input.value;
      recomputeAndPublish();
    });
    input.addEventListener("input",()=>{
      const rowIndex=Number(input.dataset.r);
      const column=input.dataset.c;
      processedRows[rowIndex][column]=input.value;
      store.get().processedRows=processedRows;
    });
  });

  document.querySelectorAll("[data-delete-row-id]").forEach(button=>{
    button.addEventListener("click",()=>{
      const source=button.closest("tr")?.querySelector("td:nth-child(2) small")?.textContent||"this row";
      if(confirm(`Delete ${source} from validation and export?`))deleteRow(button.dataset.deleteRowId);
    });
  });
}

export function canContinue(){
  return validation.errors.length===0;
}

export function openExportWithErrorsModal(){
  const grouped=issueTypeCounts(validation.errors);
  document.getElementById("modal-root").innerHTML=`<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="export-errors-title"><h2 id="export-errors-title">Export with Errors?</h2><p>Your file has ${validation.errors.length} errors across ${new Set(validation.errors.map(error=>error.rowIndex)).size} rows. Exporting now may fail to import into Eloqua or Salesforce.</p><div class="review-error-counts">${Object.entries(grouped).map(([type,count])=>`<p><strong>${escapeHtml(type)}</strong>: ${count}</p>`).join("")}</div><div class="modal-actions"><button id="modal-cancel" class="btn btn-secondary">Cancel</button><button id="modal-confirm" class="btn btn-primary">Export Anyway</button></div></div></div>`;
  document.getElementById("modal-cancel").onclick=()=>document.getElementById("modal-root").innerHTML="";
  document.getElementById("modal-confirm").onclick=()=>{
    store.set({exportWithErrors:true,processedRows,validation},{stepTransition:true});
    document.getElementById("modal-root").innerHTML="";
    setStep(6);
  };
}
