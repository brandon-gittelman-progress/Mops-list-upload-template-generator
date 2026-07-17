import{store}from"../store.js";
import{geo}from"../modules/geo.js";

const REQUIRED_TEMPLATE_COLUMNS=new Set([
  "Last Response Date",
  "First Name",
  "Last Name",
  "Email Address",
  "Company Name",
  "Country",
  "Campaign Source",
  "Lead Source - Most Recent",
  "Product",
  "Call to Action",
  "Target Channel Type",
  "Campaign Member Status",
  "SFDC Campaign ID"
]);

let cached=[];

function keyPart(value){return String(value??"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
function issueKey(issue){if(issue.type==="partial")return`partial-${keyPart(issue.file.id)}-${keyPart(issue.templateColumn)}-${keyPart(issue.sourceColumn)}`;if(issue.type==="malmql")return`malmql-${keyPart(issue.file.id)}`;if(issue.type==="stateBlanking")return`stateblank-${keyPart(issue.file.id)}`;return`issue-${keyPart(issue.type)}`;}
function selectedResolution(state,key){return state.confirmations?.[key]||"";}
function hasExistingForceValues(file,maps){const forceMalSource=Object.entries(maps).find(([,m])=>m.mappedTo==="Force MAL")?.[0];const forceMqlSource=Object.entries(maps).find(([,m])=>m.mappedTo==="Force MQL")?.[0];if(!forceMalSource&&!forceMqlSource)return false;return file.rows.some(row=>String(row[forceMalSource]??"").trim()||String(row[forceMqlSource]??"").trim());}
function stateBlankRows(file,maps){const countrySource=Object.entries(maps).find(([,m])=>m.mappedTo==="Country")?.[0];const stateSource=Object.entries(maps).find(([,m])=>m.mappedTo==="State or Province")?.[0];if(!countrySource||!stateSource)return[];return file.rows.map((row,index)=>{const rawState=String(row[stateSource]??"").trim();if(!rawState)return null;const country=geo.resolveCountry(row[countrySource]).canonical;if(country&&!geo.isStateApplicable(country))return{rowIndex:index+1,country,state:rawState};return null;}).filter(Boolean);}

export function deriveIssues(state){
  const issues=[];
  for(const file of state.files){
    const maps=state.mappings[file.id]||{};
    for(const [sourceColumn,mapping]of Object.entries(maps)){
      const templateColumn=mapping?.mappedTo;
      if(!templateColumn||!REQUIRED_TEMPLATE_COLUMNS.has(templateColumn))continue;
      const values=file.rows.map(row=>String(row[sourceColumn]??"").trim());
      const filled=values.filter(Boolean);
      if(filled.length>0&&filled.length<values.length){
        const unique=[...new Set(filled.map(value=>value.toLowerCase().replace(/\s+/g," ").trim()))];
        issues.push({type:"partial",file,sourceColumn,templateColumn,filled:filled.length,total:values.length,missing:values.length-filled.length,unique:unique.length===1?filled[0]:null});
      }
    }
    if((file.detectedMalMqlRows||[]).length)issues.push({type:"malmql",file,requiresResolution:hasExistingForceValues(file,maps)});
    const blankRows=stateBlankRows(file,maps);
    if(blankRows.length)issues.push({type:"stateBlanking",file,rows:blankRows,requiresResolution:false});
  }
  return issues;
}

export function render(){const state=store.get();cached=deriveIssues(state);if(!cached.length)return`<section><h1 class="step-title">Confirm Your Data</h1><div class="card"><span class="pill">Skipped — no confirmation needed</span><h2>No confirmation needed.</h2><p>Your files are complete. Continue to Campaign Settings.</p></div></section>`;return`<section><h1 class="step-title">Confirm Your Data</h1><p class="step-subtitle">A few things about your upload need your attention before we continue.</p><div class="grid">${cached.map(issue=>renderIssue(issue,state)).join("")}</div></section>`;}
function renderIssue(issue,state){if(issue.type==="partial")return renderPartial(issue,state);if(issue.type==="malmql")return renderMalMql(issue,state);return renderStateBlanking(issue);}
function renderPartial(issue,state){const key=issueKey(issue);const selected=selectedResolution(state,key);const manualId=`confirm-${key}-manual`;const autofillId=`confirm-${key}-autofill`;return`<div class="confirm-card" data-confirm-card="${key}"><h3>${issue.templateColumn} is filled for ${issue.filled} of ${issue.total} rows</h3><p>Source column: <code>${issue.sourceColumn}</code>. ${issue.missing} rows are missing a value.</p><label for="${manualId}"><input id="${manualId}" type="radio" name="${key}" value="manual" ${selected==="manual"?"checked":""}> Fill blanks manually — leave blanks for Review</label>${issue.unique?`<br><label for="${autofillId}"><input id="${autofillId}" type="radio" name="${key}" value="autofill" ${selected==="autofill"?"checked":""}> Auto-fill blanks with "${issue.unique}"</label>`:""}${selected?`<p class="muted">Selected: ${selected==="manual"?"Fill blanks manually":"Auto-fill blanks"}</p>`:""}</div>`;}
function renderMalMql(issue,state){const detections=issue.file.detectedMalMqlRows||[];const mal=detections.filter(row=>row.kind==="MAL").length;const mql=detections.filter(row=>row.kind==="MQL").length;const columns=[...new Set(detections.map(row=>row.sourceColumn))].join(", ");const key=issueKey(issue);const selected=selectedResolution(state,key);if(!issue.requiresResolution)return`<div class="confirm-card"><h3>Lead stage detected: ${mal} MAL, ${mql} MQL</h3><p>We found MAL and/or MQL in source column(s): ${columns}. These will set Force MAL / Force MQL to Yes on matching rows.</p><p class="muted">No overwrite confirmation is needed because Force MAL / Force MQL is not already populated.</p><p class="muted">If a row contains both MAL and MQL, we'll apply MAL.</p></div>`;return`<div class="confirm-card" data-confirm-card="${key}"><h3>Lead stage detected: ${mal} MAL, ${mql} MQL</h3><p>We found MAL and/or MQL in source column(s): ${columns}. Applying detected values may overwrite existing Force MAL / Force MQL values.</p><label for="confirm-${key}-overwrite"><input id="confirm-${key}-overwrite" type="radio" name="${key}" value="overwrite" ${selected==="overwrite"?"checked":""}> Overwrite existing with detected values</label><br><label for="confirm-${key}-keep"><input id="confirm-${key}-keep" type="radio" name="${key}" value="keep" ${selected==="keep"?"checked":""}> Keep existing values, do not apply detected</label><p class="muted">If a row contains both MAL and MQL, we'll apply MAL.</p></div>`;}
function renderStateBlanking(issue){const shown=issue.rows.slice(0,10).map(row=>`Row ${row.rowIndex}: ${row.state} will be blanked because Country is ${row.country}`).join("<br>");const more=issue.rows.length>10?`<br>...and ${issue.rows.length-10} more rows`:"";return`<div class="confirm-card"><h3>State will be blanked for ${issue.rows.length} rows</h3><p>State or Province is populated for rows whose Country is not United States or Canada. These State values will be blanked on export.</p><p class="muted">${shown}${more}</p></div>`;}
export function bind(){document.querySelectorAll("input[type='radio'][name^='partial-'],input[type='radio'][name^='malmql-']").forEach(input=>{input.addEventListener("change",()=>{store.set({confirmations:{...store.get().confirmations,[input.name]:input.value}});});});}
export function canContinue(state){const issues=cached.length?cached:deriveIssues(state);return issues.every(issue=>{if(issue.type==="stateBlanking")return true;if(issue.type==="malmql"&&!issue.requiresResolution)return true;return Boolean(state.confirmations?.[issueKey(issue)]);});}
