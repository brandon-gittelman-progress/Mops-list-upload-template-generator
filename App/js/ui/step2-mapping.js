import{store}from"../store.js";
import{stableId}from"../util/dom.js";

const KEEP_FIELD_VALUE="__KEEP_FIELD__";

function escapeHtml(value){
  return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
}

function optionMarkup(value,label,selectedValue){
  return `<option value="${escapeHtml(value)}" ${selectedValue===value?"selected":""}>${escapeHtml(label)}</option>`;
}

export function render(){
  const state=store.get();
  const file=state.files.find(item=>item.id===(state.activeFileId||state.files[0]?.id));

  if(!file){
    return `<section><h1 class="step-title">Map Your Columns</h1><p>No files uploaded.</p></section>`;
  }

  const templateColumns=Object.keys(state.picklists.columnSynonyms||{}).filter(column=>column!=="Lead Source - Initial");

  return `<section><h1 class="step-title">Map Your Columns</h1><p class="step-subtitle">Map source columns to the upload template, leave columns unmapped, or choose Keep Field to append a source column to the export.</p>${renderTabs(state)}<div class="grid">${file.headers.map(sourceColumn=>renderMappingRow(state,file,sourceColumn,templateColumns)).join("")}</div></section>`;
}

function renderTabs(state){
  if(state.files.length<2)return"";
  return `<div class="tabs">${state.files.map(file=>`<button id="tab-map-${file.id}" class="tab ${file.id===state.activeFileId?"active":""}">${escapeHtml(file.name)}</button>`).join("")}</div>`;
}

function renderMappingRow(state,file,sourceColumn,templateColumns){
  const mapping=state.mappings[file.id]?.[sourceColumn]||{};
  const mappedTo=mapping.mappedTo||"";
  const rowId=stableId("map",file.id,sourceColumn);
  const options=[
    optionMarkup("","Unmapped",mappedTo),
    optionMarkup(KEEP_FIELD_VALUE,"Keep field - add to export",mappedTo),
    ...templateColumns.map(column=>optionMarkup(column,column,mappedTo))
  ].join("");
  const confidenceClass=String(mapping.confidence||"None").toLowerCase().replace(/[^a-z0-9]+/g,"-");
  const confidenceLabel=mappedTo===KEEP_FIELD_VALUE?"KEEP":(mapping.confidence||"None").toUpperCase();
  const keepNote=mappedTo===KEEP_FIELD_VALUE?`<div class="suggestion" role="status">This source column will be appended to the export as <strong>${escapeHtml(sourceColumn)}</strong>.</div>`:"";
  const suggestion=mapping.suggestion?`<div class="suggestion" role="status">Did you mean ${escapeHtml(mapping.suggestion.templateColumn)}? <a href="#" id="accept-${rowId}" data-file="${escapeHtml(file.id)}" data-col="${escapeHtml(sourceColumn)}" data-suggestion="${escapeHtml(mapping.suggestion.templateColumn)}">Accept</a></div>`:"";

  return `<div class="mapping-row"><div><strong>${escapeHtml(sourceColumn)}</strong>${keepNote}${suggestion}</div><span class="tag ${confidenceClass}">${confidenceLabel}${mapping.language?` · ${escapeHtml(mapping.language)}`:""}</span><select id="${rowId}" data-file="${escapeHtml(file.id)}" data-col="${escapeHtml(sourceColumn)}">${options}</select></div>`;
}

export function bind(){
  const state=store.get();

  document.querySelectorAll("select[data-col]").forEach(select=>{
    select.addEventListener("change",()=>{
      const mappings={...store.get().mappings};
      const fileId=select.dataset.file;
      const sourceColumn=select.dataset.col;
      if(!mappings[fileId])mappings[fileId]={};
      mappings[fileId][sourceColumn]={
        ...(mappings[fileId][sourceColumn]||{}),
        mappedTo:select.value||null,
        confidence:select.value===KEEP_FIELD_VALUE?"Keep":select.value?"Manual":"None",
        suggestion:null
      };
      store.set({mappings});
    });
  });

  state.files.forEach(file=>{
    document.getElementById(`tab-map-${file.id}`)?.addEventListener("click",()=>{
      store.set({activeFileId:file.id},{stepTransition:true});
    });
  });

  document.querySelectorAll("[id^='accept-map-']").forEach(anchor=>{
    anchor.addEventListener("click",event=>{
      event.preventDefault();
      const fileId=anchor.dataset.file;
      const sourceColumn=anchor.dataset.col;
      const suggestion=anchor.dataset.suggestion;
      const mappings={...store.get().mappings};
      if(!mappings[fileId])mappings[fileId]={};
      mappings[fileId][sourceColumn]={
        ...(mappings[fileId][sourceColumn]||{}),
        mappedTo:suggestion,
        confidence:"Manual",
        suggestion:null
      };
      store.set({mappings});
    });
  });
}
