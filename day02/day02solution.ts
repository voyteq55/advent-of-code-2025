import * as fs from "node:fs/promises";

const FILE_PATH = "day02input.txt";

interface Solution {
  partOneSolution: number;
  partTwoSolution: number;
}

function solvePartOne(ranges: [number, number][]) {
  const maxPotentialInvalidId = getMaxPotentialInvalidId(ranges);
  let currentInvalidIdsSum = 0;

  for (const potentialInvalidId of getPotentialInvalidIdsGenerator(
    maxPotentialInvalidId,
  )) {
    if (isInRange(potentialInvalidId, ranges)) {
      currentInvalidIdsSum += potentialInvalidId;
    }
  }

  return currentInvalidIdsSum;
}

function solvePartTwo(ranges: [number, number][]) {
  const maxPotentialInvalidId = getMaxPotentialInvalidId(ranges);
  const invalidIds = new Set<number>();

  for (const potentialInvalidId of getPotentialInvalidIdsWithMultipleRepetitionsGenerator(
    maxPotentialInvalidId,
  )) {
    if (isInRange(potentialInvalidId, ranges)) {
      invalidIds.add(potentialInvalidId);
    }
  }

  let currentInvalidIdsSum = 0;
  for (const id of invalidIds) {
    currentInvalidIdsSum += id;
  }
  return currentInvalidIdsSum;
}

function constructRanges(input: string): [number, number][] {
  const ranges: [number, number][] = [];
  const rangeTexts = input.trim().split(",");

  for (const rangeText of rangeTexts) {
    const range = rangeText.split("-").map((id) => parseInt(id));
    ranges.push(range as [number, number]);
  }

  return ranges;
}

function* getPotentialInvalidIdsGenerator(maxId: number) {
  let currentNum = 1;
  let currentPotentialInvalidId = 11;
  while (currentPotentialInvalidId <= maxId) {
    yield currentPotentialInvalidId;

    currentNum++;
    currentPotentialInvalidId = parseInt(`${currentNum}${currentNum}`);
  }
}

function* getPotentialInvalidIdsWithMultipleRepetitionsGenerator(
  maxId: number,
) {
  let currentNum = 1;
  while (parseInt(`${currentNum}${currentNum}`) <= maxId) {
    let currentPotentialIdText = `${currentNum}${currentNum}`;
    while (parseInt(currentPotentialIdText) <= maxId) {
      yield parseInt(currentPotentialIdText);
      currentPotentialIdText += currentNum;
    }
    currentNum++;
  }
}

function isInRange(id: number, ranges: [number, number][]) {
  for (const range of ranges) {
    if (id >= range[0] && id <= range[1]) {
      return true;
    }
  }
  return false;
}

function getMaxPotentialInvalidId(ranges: [number, number][]) {
  let currentMaxPotentialInvalidId = 0;
  for (const range of ranges) {
    currentMaxPotentialInvalidId = Math.max(
      currentMaxPotentialInvalidId,
      range[1],
    );
  }
  return currentMaxPotentialInvalidId;
}

async function solveFromFile(filePath: string): Promise<Solution> {
  const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
  const ranges = constructRanges(fileContent);
  return {
    partOneSolution: solvePartOne(ranges),
    partTwoSolution: solvePartTwo(ranges),
  };
}

solveFromFile(FILE_PATH).then(({ partOneSolution, partTwoSolution }) => {
  console.log(`Part 1: ${partOneSolution}`);
  console.log(`Part 2: ${partTwoSolution}`);
});
