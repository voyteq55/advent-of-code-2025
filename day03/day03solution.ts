import * as fs from "node:fs/promises";

const FILE_PATH = "day03input.txt";

const PART_ONE_JOLTAGE_DIGIT_COUNT = 2;
const PART_TWO_JOLTAGE_DIGIT_COUNT = 12;

interface Solution {
  partOne: number;
  partTwo: number;
}

function getMaxJoltageOfBank(bank: string, joltageLength: number): number {
  const turnedOnBatteries = [];
  let lastTurnedOnBatteryIndex = -1;
  let nextSearchRangeEndInlusive = bank.length - joltageLength;

  while (nextSearchRangeEndInlusive < bank.length) {
    lastTurnedOnBatteryIndex = getMaxValueIndexFromRange(
      bank,
      lastTurnedOnBatteryIndex + 1,
      nextSearchRangeEndInlusive,
    );

    turnedOnBatteries.push(bank.charAt(lastTurnedOnBatteryIndex));

    nextSearchRangeEndInlusive++;
  }

  return joltageFromArray(turnedOnBatteries);
}

function getMaxValueIndexFromRange(
  bank: string,
  startIndexInclusive: number,
  endIndexInclusive: number,
) {
  let currentMaxValue = "0";
  let currentMaxIndex = -1;
  for (let i = startIndexInclusive; i <= endIndexInclusive; i++) {
    const currentValue = bank.charAt(i);
    if (currentValue > currentMaxValue) {
      currentMaxIndex = i;
      currentMaxValue = currentValue;
    }
  }
  return currentMaxIndex;
}

function joltageFromArray(batteries: string[]): number {
  let currentJoltage = 0;
  for (const battery of batteries) {
    currentJoltage *= 10;
    currentJoltage += parseInt(battery);
  }
  return currentJoltage;
}

function solve(banks: string[]): Solution {
  let partOneTotalOutputJoltage = 0;
  let partTwoTotalOutputJoltage = 0;

  for (const bank of banks) {
    partOneTotalOutputJoltage += getMaxJoltageOfBank(
      bank,
      PART_ONE_JOLTAGE_DIGIT_COUNT,
    );
    partTwoTotalOutputJoltage += getMaxJoltageOfBank(
      bank,
      PART_TWO_JOLTAGE_DIGIT_COUNT,
    );
  }

  return {
    partOne: partOneTotalOutputJoltage,
    partTwo: partTwoTotalOutputJoltage,
  };
}

async function solveFromFile(filePath: string): Promise<Solution> {
  const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
  return solve(
    fileContent
      .trim()
      .split("\n")
      .map((line) => line.trim()),
  );
}

solveFromFile(FILE_PATH).then((solution) => {
  console.log(solution);
});
