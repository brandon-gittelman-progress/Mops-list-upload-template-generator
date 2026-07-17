import{store}from"../store.js";
import{stableId}from"../util/dom.js";
import{todayIso}from"../util/date-utils.js";

const REQUIRED_FIELDS=new Set([
  "Campaign Source",
  "SFDC Campaign ID",
  "Last Response Date",
  "Product",
  "Lead Source - Most Recent",
  "Call to Action",
  "Target Channel Type",
  "Campaign Member Status"
]);

const PICKLIST_FIELDS={
  "Product":"Product",
  "Lead Source - Most Recent":"Lead Source - Most Recent",
  "Call to Action":"Call to Action",
  "Target Channel Type":"Target Channel Type",
  "Campaign Member Status":"Campaign Member Status",
  "utm_medium":"utm_medium"
};

const CHECKBOX_FIELDS=new Set(["Force MQL","Force MAL","Manual Lead Assignment","Bypass Bogus Program"]);
const DATE_FIELDS=new Set(["Last Response Date"]);

const SECTIONS=[
  {title:"Campaign Identification",className:"settings-card settings-card-wide",fields:["Campaign Source","SFDC Campaign ID","Last Response Date"]},
  {title:"Categorization",className:"settings-card",fields:["Product","Lead Source - Most Recent","Call to Action","Target Channel Type","Campaign Member Status"]},
  {title:"UTM Parameters",className:"settings-card",fields:["utm_medium","utm_source","utm_campaign","Offer Title"]},
  {title:"Lead Routing",className:"settings-card",fields:["Lead Owner ID","Manual Lead Assignment"]},
  {title:"Marketing Ops",className:"settings-card settings-card-muted",fields:["Force MQL","Force MAL","External Asset Status","Bypass Bogus Program"]}
];

export function render(){
  const state=store.get();
  const file=state.files.find(item=>item.id===(state.activeFileId||state.files[0]?.id));
  if(!file){
    return `<section><h1 class="step-title">Configure Campaign Settings</h1><p class="step-subtitle">Upload a file before configuring campaign settings.</p></section>`;
  }

  return `<section class="settings-step"><h1 class="step-title">Configure Campaign Settings</h1><p class="step-subtitle">These values will apply to all rows in each file.</p>${renderTabs(state)}<div class="settings-page-card"><div class="settings-layout">${SECTIONS.map(section=>renderSection(section,state,file)).join("")}</div></div></section>`;
}

function renderTabs(state){
  if(state.files.length<2)return"";
  return `<div class="tabs">${state.files.map(file=>`<button id="tab-settings-${file.id}" class="tab ${file.id===state.activeFileId?"active":""}">${escapeHtml(file.name)}</button>`).join("")}</div>`;
}

function renderSection(section,state,file){
  const hidden=hiddenFieldsForSection(section,state,file);
  const showHidden=Boolean(state.settings?.showHiddenGroups?.[section.title]);
  const visibleFields=section.fields.filter(field=>showHidden||!hidden.includes(field));
  const sectionId=stableId("settings-section",section.title);
  const fieldMarkup=visibleFields.length
    ? `<div class="settings-fields ${section.title==="Campaign Identification"?"settings-fields-three":""}">${visibleFields.map(field=>renderField(field,state)).join("")}</div>`
    : `<p class="muted settings-empty">Nothing to configure — your upload provided every value in this group.</p>`;

  return `<section class="${section.className}" aria-labelledby="${sectionId}"><h2 id="${sectionId}">${section.title}</h2>${hidden.length?renderHiddenBanner(section,hidden):""}${fieldMarkup}</section>`;
}

function renderHiddenBanner(section,hidden){
  const id=stableId("show-hidden",section.title);
  return `<div class="banner hidden-fields-banner">ℹ ${hidden.length} field(s) hidden — already provided by upload. <button id="${id}" class="btn btn-tertiary" data-show-hidden-group="${escapeAttr(section.title)}">Show anyway ▸</button></div>`;
}

function hiddenFieldsForSection(section,state,file){
  const maps=state.mappings[file.id]||{};
  const hidden=[];
  for(const [sourceColumn,mapping]of Object.entries(maps)){
    if(!mapping?.mappedTo)continue;
    if(mapping.mappedTo==="Lead Source - Initial")continue;
    if(!section.fields.includes(mapping.mappedTo))continue;
    if(file.rows.every(row=>String(row[sourceColumn]??"").trim()))hidden.push(mapping.mappedTo);
  }
  return hidden;
}

function renderField(name,state){
  const id=stableId("setting",name);
  const value=getSettingValue(state,name);
  const required=REQUIRED_FIELDS.has(name)?` <span aria-hidden="true">*</span>`:"";
  const labelText=`${labelTextFor(name)}${required}`;

  if(PICKLIST_FIELDS[name]){
    return `<div class="field settings-field"><label for="${id}">${labelText}</label><select id="${id}" data-setting="${escapeAttr(name)}"><option value="">Select...</option>${picklistOptions(state,PICKLIST_FIELDS[name],value)}</select></div>`;
  }

  if(CHECKBOX_FIELDS.has(name)){
    return `<div class="settings-checkbox-row"><input id="${id}" type="checkbox" data-setting="${escapeAttr(name)}" ${value===true||value==="Yes"?"checked":""}><label for="${id}">${labelTextFor(name)}</label></div>`;
  }

  if(DATE_FIELDS.has(name)){
    return `<div class="field settings-field"><label for="${id}">${labelText}</label><input id="${id}" class="input" type="date" data-setting="${escapeAttr(name)}" value="${escapeAttr(value)}"></div>`;
  }

  if(name==="SFDC Campaign ID"){
    const count=String(value||"").length;
    return `<div class="field settings-field"><div class="settings-label-row"><label for="${id}">${labelText}</label><span id="${id}-count" class="char-count">${count}/18</span></div><input id="${id}" class="input" maxlength="18" type="text" data-setting="${escapeAttr(name)}" value="${escapeAttr(value)}"></div>`;
  }

  if(name==="Lead Owner ID"){
    const count=String(value||"").length;
    return `<div class="field settings-field"><div class="settings-label-row"><label for="${id}">${labelText}</label><span id="${id}-count" class="char-count">${count}/18</span></div><input id="${id}" class="input" maxlength="18" type="text" data-setting="${escapeAttr(name)}" value="${escapeAttr(value)}"></div>`;
  }

  return `<div class="field settings-field"><label for="${id}">${labelText}</label><input id="${id}" class="input" type="text" data-setting="${escapeAttr(name)}" value="${escapeAttr(value)}"></div>`;
}

function getSettingValue(state,name){
  if(state.settings?.[name]!=null)return state.settings[name];
  if(name==="Last Response Date")return todayIso();
  return "";
}

function picklistOptions(state,picklistName,value){
  const options=state.picklists?.picklists?.[picklistName]||[];
  return options.map(option=>`<option value="${escapeAttr(option)}" ${String(value)===String(option)?"selected":""}>${escapeHtml(option)}</option>`).join("");
}

function labelTextFor(name){
  return name.toUpperCase();
}

function refreshCount(input){
  const count=document.getElementById(`${input.id}-count`);
  if(count)count.textContent=`${input.value.length}/18`;
}

function escapeHtml(value){
  return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function escapeAttr(value){
  return escapeHtml(value);
}

export function bind(){
  const state=store.get();

  state.files.forEach(file=>{
    document.getElementById(`tab-settings-${file.id}`)?.addEventListener("click",()=>{
      store.set({activeFileId:file.id},{stepTransition:true});
    });
  });

  document.querySelectorAll("[data-show-hidden-group]").forEach(button=>{
    button.addEventListener("click",()=>{
      const groupTitle=button.dataset.showHiddenGroup;
      const current=store.get().settings?.showHiddenGroups||{};
      store.set({settings:{...store.get().settings,showHiddenGroups:{...current,[groupTitle]:true}}});
    });
  });

  document.querySelectorAll("[data-setting]").forEach(input=>{
    input.addEventListener("input",()=>applySettingChange(input));
    input.addEventListener("change",()=>applySettingChange(input));
  });
}

function applySettingChange(input){
  const name=input.dataset.setting;
  const settings={...store.get().settings};

  if(input.type==="checkbox"){
    settings[name]=input.checked;
    if(name==="Force MQL"&&input.checked)settings["Force MAL"]=false;
    if(name==="Force MAL"&&input.checked)settings["Force MQL"]=false;
  }else{
    settings[name]=input.value;
    if(name==="SFDC Campaign ID"||name==="Lead Owner ID")refreshCount(input);
    if(name==="Lead Owner ID")settings["Manual Lead Assignment"]=Boolean(input.value.trim());
  }

  store.set({settings});
}
