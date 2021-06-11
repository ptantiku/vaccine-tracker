const BigNumber = require('bignumber.js');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const data = require('./data.json');

dayjs.extend(relativeTime);

const BLOCK = '▓';
const BLANK = '░';

const MAX_BLOCKS = 20;

const targetDoses = new BigNumber('100e6');
const targetDate = dayjs('2022-01-01'); // dayjs('2021-12-31');

async function main() {

  /*
   * Total Population of Thailand
   * from: https://stat.bora.dopa.go.th/new_stat/webPage/statByAgeMonth.php
   * Date: Month=April 2021 (visit 28 May 2021)
   */
  const population = new BigNumber(data.population);
  const allDataDates = Object.keys(data.doses).sort();
  const latestDate = allDataDates.pop();
  const dose1 = new BigNumber(data.doses[latestDate][0]);
  const dose2 = new BigNumber(data.doses[latestDate][1]);
  const totalDoses = dose1.plus(dose2);

  const prevDate = allDataDates.pop();
  const prevDose1 = new BigNumber(data.doses[prevDate][0]);
  const prevDose2 = new BigNumber(data.doses[prevDate][1]);
  const prevTotalDoses = prevDose1.plus(prevDose2);
  const perfDose1 = dose1.minus(prevDose1);
  const perfDose2 = dose2.minus(prevDose2);
  const perfTotalDoses = totalDoses.minus(prevTotalDoses);

  console.log(`1st Doses   = ${dose1.toFormat(0)} (+${perfDose1.toFormat(0)})`);
  console.log(`2nd Doses   = ${dose2.toFormat(0)} (+${perfDose2.toFormat(0)})`);
  console.log(`Total doses = ${totalDoses.toFormat(0)} (+${perfTotalDoses.toFormat(0)})`)

  const dose1Percent = dose1.div(population).times(100);
  const dose2Percent = dose2.div(population).times(100);

  const dose1Tick = Math.ceil(dose1Percent.div(100).times(MAX_BLOCKS).toNumber());
  const dose2Tick = Math.ceil(dose2Percent.div(100).times(MAX_BLOCKS).toNumber());
  dose1Arr = new Array(MAX_BLOCKS).fill(BLANK);
  dose2Arr = new Array(MAX_BLOCKS).fill(BLANK);
  dose1Arr.fill(BLOCK, 0, dose1Tick);
  dose2Arr.fill(BLOCK, 0, dose2Tick);

  const targetPercent = totalDoses.div(targetDoses).times(100);
  const targetTick = Math.ceil(targetPercent.div(100).times(MAX_BLOCKS).toNumber());
  targetArr = new Array(MAX_BLOCKS).fill(BLANK);
  targetArr.fill(BLOCK, 0, targetTick);

  const dataDate = dayjs().subtract(1, 'day'); // dataDate is yesterday
  const remainingDays = targetDate.diff(dataDate, 'days');
  const avgRemainingVaccinePerDay = targetDoses.minus(totalDoses).div(remainingDays);

  const output = `
    Thailand Vaccine Tracker

    วัคซีนเข็มที่ 1:            ${dose1.toFormat(0)}
    ${dose1Arr.join('')} ${dose1Percent.toFormat(2)} %

    วัคซีนเข็มที่ 2:            ${dose2.toFormat(0)}
    ${dose1Arr.join('')} ${dose2Percent.toFormat(2)} %

    เป้าหมาย 100 ล้านโดส:
    ${targetArr.join('')} ${targetPercent.toFormat(2)} %

    เหลือเวลา ${remainingDays} วัน:
    > ต้องฉีดเฉลี่ย   ${avgRemainingVaccinePerDay.toFormat(0)}/วัน
    > ล่าสุดฉีดได้    ${perfTotalDoses.toFormat(0)}/วัน
    ยอดฉีดรวม ${dose1.toFormat(0)} + ${dose2.toFormat(0)} = ${totalDoses.toFormat(0)} โดส
    (ข้อมูล ${dayjs(dataDate).format('DD/MM/YYYY')})
    `.replace(/\n[ \t]+/g, '\n'); // dedent
  console.log(output);
}

main();
