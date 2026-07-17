export function toCsv(rows,columns){
  const esc=value=>{
    const text=String(value??"");
    const escaped=text.replace(/"/g,'""');
    return /[",\n\r]/.test(text)?`"${escaped}"`:escaped;
  };
  const lines=[
    columns.map(esc).join(","),
    ...rows.map(row=>columns.map(column=>esc(row[column])).join(","))
  ];
  return "\ufeff"+lines.join("\n");
}

export function downloadBlob(name,mime,text){
  const blob=new Blob([text],{type:mime});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=url;
  anchor.download=name;
  document.body.append(anchor);
  anchor.click();
  setTimeout(()=>{
    URL.revokeObjectURL(url);
    anchor.remove();
  },0);
}
