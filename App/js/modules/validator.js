import{geo}from"./geo.js";

export const TEMPLATE_COLUMNS=[
  "Last Response Date",
  "First Name",
  "Last Name",
  "Email Address",
  "Company Name",
  "Address 1",
  "City",
  "State or Province",
  "Zip or Postal Code",
  "Country",
  "Business Phone",
  "Title",
  "Industry",
  "Revenue",
  "Employee Size",
  "Electronic Message Opt Out",
  "Opt In - Explicit Date",
  "Campaign Source",
  "Lead Source - Most Recent",
  "Product",
  "Call to Action",
  "Target Channel Type",
  "Form Comments",
  "Offer Title",
  "Website",
  "Campaign Member Status",
  "SFDC Campaign ID",
  "utm_medium",
  "utm_source",
  "utm_campaign",
  "Force MQL",
  "Force MAL",
  "External Asset Status",
  "Lead Owner ID",
  "Manual Lead Assignment",
  "Bypass Bogus Program"
];

const required=new Set([
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

export function validateRows(rows){
  const errors=[];
  const warnings=[];
  const seen=new Map();

  rows.forEach((row,i)=>{
    for(const column of required){
      if(!String(row[column]??"").trim()){
        errors.push({rowIndex:i,type:`Missing ${column}`,column});
      }
    }

    if(row["Email Address"]&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(row["Email Address"]))){
      errors.push({rowIndex:i,type:"Invalid Email",column:"Email Address"});
    }

    if(row["SFDC Campaign ID"]&&String(row["SFDC Campaign ID"]).trim().length!==18){
      errors.push({rowIndex:i,type:"Invalid SFDC Campaign ID",column:"SFDC Campaign ID"});
    }

    if(row["Lead Owner ID"]&&String(row["Lead Owner ID"]).trim().length!==18){
      errors.push({rowIndex:i,type:"Invalid Lead Owner ID",column:"Lead Owner ID"});
    }

    const countryResult=geo.resolveCountry(row.Country);
    if(row.Country&&!countryResult.matched){
      errors.push({rowIndex:i,type:"CountryUnresolved",column:"Country"});
    }

    const stateResult=geo.resolveState(row["State or Province"],countryResult.canonical);
    if(row["State or Province"]&&stateResult.applicable&&!stateResult.matched){
      errors.push({rowIndex:i,type:"StateUnresolved",column:"State or Province"});
    }

    if(row["State or Province"]&&countryResult.canonical&&!geo.isStateApplicable(countryResult.canonical)){
      warnings.push({rowIndex:i,type:"StateWillBeBlanked",column:"State or Province",country:countryResult.canonical});
    }

    if(row["Force MQL"]&&row["Force MAL"]){
      errors.push({rowIndex:i,type:"Force MQL/MAL mutually exclusive",column:"Force MQL"});
    }

    const duplicateKey=`${String(row["Email Address"]||"").toLowerCase()}|${row.Product||""}`;
    if(row["Email Address"]&&row.Product){
      if(seen.has(duplicateKey)){
        errors.push({rowIndex:i,type:"Duplicate Email + Product",column:"Email Address"});
      }
      seen.set(duplicateKey,i);
    }
  });

  return{errors,warnings};
}
