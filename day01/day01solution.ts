import * as fs from "node:fs/promises";

const FILE_PATH = "day01input.txt";
const STARTING_NUMBER = 50;

interface Solution {
  numberOfTimesPointingAtZeroAtRotationEnd: number;
  totalNumberOfTimesPointingAtZero: number;
}

function solve(rotations: string[], startingNumber: number): Solution {
  let numberOfTimesPointingAtZeroAtRotationEnd = 0;
  let movesThroughZeroWithoutRotationEndsOnZero = 0;

  let currentNumber = startingNumber;

  for (const rotation of rotations) {
    const distance = getDistanceFromRotation(rotation);
    movesThroughZeroWithoutRotationEndsOnZero +=
      getMovesThroughZeroWithoutRotationEndsAtZero(currentNumber, distance);
    currentNumber += distance;
    if (currentNumber % 100 === 0) {
      numberOfTimesPointingAtZeroAtRotationEnd++;
    }
  }

  return {
    numberOfTimesPointingAtZeroAtRotationEnd,
    totalNumberOfTimesPointingAtZero:
      numberOfTimesPointingAtZeroAtRotationEnd +
      movesThroughZeroWithoutRotationEndsOnZero,
  };
}

function getDistanceFromRotation(rotation: string): number {
  const directionMultiplier = rotation.charAt(0) === "L" ? -1 : 1;

  return parseInt(rotation.slice(1)) * directionMultiplier;
}

function getMovesThroughZeroWithoutRotationEndsAtZero(
  currentNumber: number,
  distance: number,
): number {
  let moves = Math.abs(
    Math.floor(currentNumber / 100) -
      Math.floor((currentNumber + distance) / 100),
  );
  if (currentNumber % 100 === 0 && distance < 0) {
    moves -= 1;
  }
  if ((currentNumber + distance) % 100 === 0 && distance > 0) {
    moves -= 1;
  }
  return moves;
}

async function solveFromFile(filePath: string, startingNumber: number) {
  const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });

  const lines = fileContent.trim().split("\n");

  return solve(lines, startingNumber);
}

solveFromFile(FILE_PATH, STARTING_NUMBER).then((solution) => {
  const {
    numberOfTimesPointingAtZeroAtRotationEnd,
    totalNumberOfTimesPointingAtZero,
  } = solution;

  console.log(`Part 1: ${numberOfTimesPointingAtZeroAtRotationEnd}`);
  console.log(`Part 2: ${totalNumberOfTimesPointingAtZero}`);
});
