import{store}from"../store.js";

export function renderHeader(){
  const state=store.get();
  const restartLabel=state.teams.inTeams?"↻":"↻ Start Over";
  return `<header class="app-header"><div class="brand"><span class="logo-mark"></span><span>Progress List Upload Formatter</span>${state.teams.inTeams?'<span class="teams-pill">In Teams</span>':''}</div><div class="header-actions"><button id="theme-toggle" class="btn header-btn" type="button">Toggle Theme</button><button id="start-over" class="btn header-btn" type="button" title="Start Over">${restartLabel}</button></div></header>`;
}

export function bindHeader(){
  document.getElementById("theme-toggle")?.addEventListener("click",()=>{
    if(store.get().teams.inTeams)return;
    const root=document.documentElement;
    root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";
  });

  document.getElementById("start-over")?.addEventListener("click",()=>{
    if(!confirm("Start over and clear uploaded files, mappings, settings, confirmations, review edits, and export state?"))return;

    const current=store.get();
    store.set({
      wizard:{step:1,maxCompletedStep:1,step3Applicable:false},
      teams:current.teams,
      picklists:current.picklists,
      files:[],
      activeFileId:null,
      mappings:{},
      settings:{},
      confirmations:{partials:{},malMql:{}},
      reviewEdits:{},
      processedRows:[],
      validation:{errors:[],warnings:[]},
      exportWithErrors:false,
      exportFormat:"csv",
      lastError:null
    },{stepTransition:true});
  });
}
