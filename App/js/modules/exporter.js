import{toCsv,downloadBlob}from"../util/csv.js";
import{todayIso}from"../util/date-utils.js";
import{geo}from"./geo.js";
import{TEMPLATE_COLUMNS}from"./validator.js";

function extraExportColumns(rows){
  const extras=[];
  const base=new Set(TEMPLATE_COLUMNS);
  for(const row of rows||[]){
    for(const column of Object.keys(row||{})){
      if(column.startsWith("__"))continue;
      if(base.has(column))continue;
      if(!extras.includes(column))extras.push(column);
    }
  }
  return extras;
}

export function getExportColumns(rows){
  return [...TEMPLATE_COLUMNS,...extraExportColumns(rows)];
}

export function normalizeRow(row){
  const out={...row};
  const country=geo.resolveCountry(out.Country).canonical||out.Country||"";
  out.Country=country;
  if(geo.isStateApplicable(country)){
    out["State or Province"]=geo.resolveState(out["State or Province"],country).canonical||out["State or Province"]||"";
  }else{
    out["State or Province"]="";
  }
  if(out["Force MAL"]&&out["Force MQL"])out["Force MQL"]="";
  delete out.__sourceFile;
  delete out.__sourceRowNumber;
  delete out.__rowId;
  return out;
}

export function buildFilename(state,ext){
  const rows=state.processedRows||[];
  const source=(rows[0]?.["Campaign Source"]||"campaign").toString().replace(/[^a-z0-9]+/gi,"_").replace(/^_|_$/g,"")||"campaign";
  return `${state.exportWithErrors?"WITH_ERRORS_":""}${source}_upload_${todayIso()}.${ext}`;
}

export function exportCsv(state){
  const rows=(state.processedRows||[]).map(normalizeRow);
  const columns=getExportColumns(rows);
  downloadBlob(buildFilename(state,"csv"),"text/csv;charset=utf-8",toCsv(rows,columns));
}

export function exportXlsx(state){
  const rows=(state.processedRows||[]).map(normalizeRow);
  const columns=getExportColumns(rows);
  const ws=XLSX.utils.json_to_sheet(rows,{header:columns});
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,"Upload");
  XLSX.writeFile(wb,buildFilename(state,"xlsx"));
}
