// getting data from 
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const DATA_URL = 'https://ddc.moph.go.th/vaccine-covid19/';

function extractNumber(str) {
  return Number(str.replace(/[,+]/g, '').trim().split(' ')[0]);
}

async function main() {
  const resp = await JSDOM.fromURL(DATA_URL);
  const dataDate = resp.window.document.querySelector('#vaccine > div > span').innerHTML;
  const dose1UpdateText = resp.window.document.querySelector('#tb_vaccine > tbody > tr:nth-child(1) > td.r11').innerHTML;
  const dose1TotalText = resp.window.document.querySelector('#tb_vaccine > tbody > tr:nth-child(1) > td.r12').innerHTML;
  const dose1Update = extractNumber(dose1UpdateText);
  const dose1Total = extractNumber(dose1TotalText);
  const dose2UpdateText = resp.window.document.querySelector('#tb_vaccine > tbody > tr:nth-child(2) > td.r21').innerHTML;
  const dose2TotalText = resp.window.document.querySelector('#tb_vaccine > tbody > tr:nth-child(2) > td.r22').innerHTML;
  const dose2Update = extractNumber(dose2UpdateText);
  const dose2Total = extractNumber(dose2TotalText);
  console.log(`
  Date: \t${dataDate}
  Dose1: \t+${dose1Update.toLocaleString()} \t${dose1Total.toLocaleString()}
  Dose2: \t+${dose2Update.toLocaleString()} \t${dose2Total.toLocaleString()}
  Total: \t+${(dose1Update + dose2Update).toLocaleString()} \t${(dose1Total + dose2Total).toLocaleString()}
  `);

  return {
    dose1Update, dose1Total,
    dose2Update, dose2Total,
  }
}

main();
