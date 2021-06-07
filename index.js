const BigNumber = require('bignumber.js');
const data = require('./data.json');

const BLOCK = '▓';
const BLANK = '░';

const MAX_BLOCKS = 20;

async function main() {

  /*
   * Total Population of Thailand
   * from: https://stat.bora.dopa.go.th/new_stat/webPage/statByAgeMonth.php
   * Date: Month=April 2021 (visit 28 May 2021)
   */
  const population = new BigNumber(data.population);
  const latestDate = Object.keys(data.doses).sort().pop();
  const dose1 = new BigNumber(data.doses[latestDate][0]);
  const dose2 = new BigNumber(data.doses[latestDate][1]);
  console.log('1st Doses   = ', dose1.toFormat(0));
  console.log('2nd Doses   = ', dose2.toFormat(0));
  console.log('Total doses = ', dose1.plus(dose2).toFormat(0))

  const dose1Percent = dose1.div(population).times(100);
  const dose2Percent = dose2.div(population).times(100);

  const dose1Tick = Math.ceil(dose1Percent.div(100).times(MAX_BLOCKS).toNumber());
  const dose2Tick = Math.ceil(dose2Percent.div(100).times(MAX_BLOCKS).toNumber());
  dose1Arr = new Array(MAX_BLOCKS).fill(BLANK);
  dose2Arr = new Array(MAX_BLOCKS).fill(BLANK);
  dose1Arr.fill(BLOCK, 0, dose1Tick);
  dose2Arr.fill(BLOCK, 0, dose2Tick);

  const targetPercent = dose1.plus(dose2).div(new BigNumber('100e6')).times(100);
  const targetTick = Math.ceil(targetPercent.div(100).times(MAX_BLOCKS).toNumber());
  targetArr = new Array(MAX_BLOCKS).fill(BLANK);
  targetArr.fill(BLOCK, 0, targetTick);

  const output = `
    Thailand Vaccine Tracker

    วัคซีนเข็มที่ 1:       ${dose1.toFormat(0)}
    ${dose1Arr.join('')} ${dose1Percent.toFormat(2)} %

    วัคซีนเข็มที่ 2:       ${dose2.toFormat(0)}
    ${dose1Arr.join('')} ${dose2Percent.toFormat(2)} %

    เป้าหมาย 100 ล้านโดส:
    ${targetArr.join('')} ${targetPercent.toFormat(2)} %

    `.replace(/\n[ \t]+/g, '\n'); // dedent
  console.log(output);
}

main();
