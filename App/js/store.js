const initialState={wizard:{step:1,maxCompletedStep:1,step3Applicable:false},teams:{inTeams:false,theme:"default"},picklists:null,files:[],activeFileId:null,mappings:{},settings:{},confirmations:{partials:{},malMql:{}},reviewEdits:{},exportWithErrors:false,exportFormat:"csv",lastError:null};
let state=structuredClone(initialState);
const bus=new EventTarget();
export const store={get(){return state},set(patch,meta={}){state=merge(state,patch);bus.dispatchEvent(new CustomEvent("change",{detail:{state,meta}}))},reset(){state=structuredClone(initialState);bus.dispatchEvent(new CustomEvent("change",{detail:{state,meta:{stepTransition:true}}}))},subscribe(fn){const h=e=>fn(e.detail.state,e.detail.meta||{});bus.addEventListener("change",h);return()=>bus.removeEventListener("change",h)}};
function isObj(v){return v&&typeof v==="object"&&!Array.isArray(v)}
function merge(base,patch){if(!isObj(patch))return patch;const out=Array.isArray(base)?base.slice():{...base};for(const [k,v]of Object.entries(patch)){out[k]=isObj(v)&&isObj(out[k])?merge(out[k],v):v}return out}
export function updateFile(fileId,patch){const files=store.get().files.map(f=>f.id===fileId?merge(f,patch):f);store.set({files})}
export function setStep(step){const cur=store.get().wizard;store.set({wizard:{...cur,step,maxCompletedStep:Math.max(cur.maxCompletedStep,step)}},{stepTransition:true})}
