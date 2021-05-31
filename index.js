const BigNumber = require('bignumber.js');
require('dotenv').config();

const BLOCK = '▓';
const BLANK = '░';

const MAX_BLOCKS = 20;

async function main() {

  /*
   * Total Population of Thailand
   * from: https://stat.bora.dopa.go.th/new_stat/webPage/statByAgeMonth.php
   * Date: Month=April 2021 (visit 28 May 2021)
   */
  const population = new BigNumber(process.env.POPULATION);
  const dose1 = new BigNumber(process.env.DOSE1);
  const dose2 = new BigNumber(process.env.DOSE2);
  console.log('1st Doses   = ', dose1.toFormat(0))
  console.log('2nd Doses   = ', dose2.toFormat(0))
  console.log('Total doses = ', dose1.plus(dose2).toFormat(0))

  const dose1Percent = dose1.div(population).times(100);
  const dose2Percent = dose2.div(population).times(100);

  const dose1Tick = Math.ceil(dose1Percent.div(100).times(MAX_BLOCKS).toNumber());
  const dose2Tick = Math.ceil(dose2Percent.div(100).times(MAX_BLOCKS).toNumber());
  dose1Arr = new Array(MAX_BLOCKS).fill(BLANK);
  dose2Arr = new Array(MAX_BLOCKS).fill(BLANK);
  dose1Arr.fill(BLOCK, 0, dose1Tick);
  dose2Arr.fill(BLOCK, 0, dose2Tick);

  const output = `
    Thailand Vaccine Tracker

    วัคซีนเข็มที่ 1:       ${dose1.toFormat(0)}
    ${dose1Arr.join('')} ${dose1Percent.toFormat(2)} %

    วัคซีนเข็มที่ 2:       ${dose2.toFormat(0)}
    ${dose1Arr.join('')} ${dose2Percent.toFormat(2)} %
    `.replace(/\n[ \t]+/g, '\n'); // dedent
  console.log(output);
}

main();
