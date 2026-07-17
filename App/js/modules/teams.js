let inTeams=false;
let currentTheme="default";

function shouldTryTeamsInit(){
  const qs=new URLSearchParams(location.search);
  if(qs.get("in")==="teams")return true;
  try{
    return window.self!==window.top;
  }catch{
    return true;
  }
}

export async function initTeams(){
  if(!shouldTryTeamsInit()){
    return{inTeams:false,theme:"default"};
  }
  if(!window.microsoftTeams){
    return{inTeams:false,theme:"default"};
  }
  try{
    await Promise.race([
      microsoftTeams.app.initialize(),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error("Teams SDK init timed out")),1500))
    ]);
    const ctx=await Promise.race([
      microsoftTeams.app.getContext(),
      new Promise((_,reject)=>setTimeout(()=>reject(new Error("Teams context timed out")),1500))
    ]);
    inTeams=true;
    currentTheme=ctx.app?.theme||"default";
    applyTheme(currentTheme);
    microsoftTeams.app.registerOnThemeChangeHandler(applyTheme);
    return{inTeams:true,theme:currentTheme};
  }catch(err){
    console.warn("[teams] SDK init failed, falling back to standalone mode",err);
    return{inTeams:false,theme:"default"};
  }
}

function applyTheme(theme){
  currentTheme=theme||"default";
  document.documentElement.dataset.teamsTheme=currentTheme;
}

export function isInTeams(){return inTeams}
export function getTheme(){return currentTheme}
