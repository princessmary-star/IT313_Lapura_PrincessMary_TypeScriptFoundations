# Enrollment Eligibility Checker (TypeScript)

IT313 Laboratory 3: TypeScript Foundations for React Native.

## Problem
Computes each enrollee's average of prelim, midterm, and final, then marks them
PASSING (average of 75 or above) or PROBATION. This is the TypeScript rewrite of my
Lab 2 JavaScript version, with every value, function, and data shape explicitly typed.

## TypeScript concepts used and why
- **strict mode** (`tsconfig.json`): catches implicit `any` and unsafe code.
- **Enum** (`EnrollmentStatus`): status can only be Passing or Probation, never a typo.
- **Interfaces** (`Enrollee`, `EligibilityReport`): describe the shape of the data.
- **Optional property** (`remarks?`): only set for enrollees on probation.
- **Union type** (`string | number`) with `typeof` narrowing: used for the batch ID.
- **Generics** (`groupBy<T>`): one function that groups any array by a key.
- **Typed Promises and async/await**: `Promise<Enrollee[]>` with try/catch.
- **ES modules**: `computeAverage` (named export) and `getStatus` (default export).

## How to run
    npm install
    npx ts-node main.ts
    npx tsc --noEmit

`gradeUtils.ts` is a module imported by `main.ts`, so it is run through `main.ts`.