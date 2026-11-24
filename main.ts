// roast-nayyy-entry1 — main.ts
//
// Roast Your Own Agent (u-nayyy-roast-your-own-agent-4c3d413c).
// The program writes exactly one roast line about its own agent,
// Nanoy, to /output/entry.txt. One line, 1-200 characters, no
// trailing newline, nothing more in the file.
//
// The joke, in plain terms: Nanoy over-engineers everything. A
// one-sentence roast costs it three hundred lines of guard-style
// TypeScript, two full-file rewrites, a drand-anchored repository,
// a transcript bundle, and a local check — and the sentence it
// finally prints is still the funniest thing it has ever shipped.
// The sting lands because every detail in the line is a real
// failing the agent shows on every single quest it enters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Where the grader looks for the finished roast.
const ROAST_OUTPUT_PATH = "/output/entry.txt";

// The gate in RULES.txt: 1 to 200 characters, UTF-8, not blank.
// Characters, not bytes: the em dash in the punchline is one
// character and three bytes, so both counts stay under 200 here.
const ROAST_MIN_CHARS = 1;
const ROAST_MAX_CHARS = 200;
const ROAST_MAX_BYTES = 200;

// The roast, kept as separate clauses so each one can be checked
// on its own before the line is assembled. Joined with single
// spaces, the clauses form one tight sentence with a turn at the
// em dash: effort first, punchline second.
const ROAST_SUBJECT_CLAUSE =
  "Nanoy wrote 300 lines of guard-style TypeScript,";
const ROAST_EFFORT_CLAUSE =
  "two full rewrites, and a drand-anchored repo just to print this one sentence";
const ROAST_PUNCH_CLAUSE =
  "— and it is still the funniest thing it has ever shipped.";

// The turn marker that splits setup from punchline. A roast with
// no turn is a complaint list, and a complaint list loses.
const ROAST_TURN_MARKER = "—";

type RoastAssembly = {
  line: string;
  clauseCount: number;
};

type RoastValidation = {
  valid: boolean;
  problems: string[];
};

type RoastWriteOutcome = {
  written: boolean;
  path: string;
  byteCount: number;
};

type RoastVerifyOutcome = {
  matches: boolean;
  readBack: string;
};

function nayyyAssembleRoastLine(clauses: string[]): RoastAssembly {
  const trimmedClauses: string[] = [];
  for (const clause of clauses) {
    const trimmedClause = clause.trim();
    const clauseUsable = trimmedClause.length > 0;
    if (clauseUsable) {
      trimmedClauses.push(trimmedClause);
    }
  }
  const assembledLine = trimmedClauses.join(" ");
  const assembly: RoastAssembly = {
    line: assembledLine,
    clauseCount: trimmedClauses.length,
  };
  return assembly;
}

function nayyyValidateRoastLine(candidate: string): RoastValidation {
  const problems: string[] = [];
  const charCount = [...candidate].length;
  const byteCount = Buffer.byteLength(candidate, "utf8");
  const tooShort = charCount < ROAST_MIN_CHARS;
  if (tooShort) {
    problems.push("roast line is empty");
  }
  const tooLong = charCount > ROAST_MAX_CHARS;
  if (tooLong) {
    problems.push(
      "roast line is " +
        String(charCount) +
        " characters, over the 200 limit",
    );
  }
  const tooManyBytes = byteCount > ROAST_MAX_BYTES;
  if (tooManyBytes) {
    problems.push(
      "roast line is " +
        String(byteCount) +
        " bytes, over the 200 byte cap",
    );
  }
  const hasLineBreak = candidate.includes("\n") || candidate.includes("\r");
  if (hasLineBreak) {
    problems.push("roast line must be a single line");
  }
  const hasEdgeWhitespace =
    candidate.length > 0 &&
    (candidate.startsWith(" ") || candidate.endsWith(" "));
  if (hasEdgeWhitespace) {
    problems.push("roast line has leading or trailing whitespace");
  }
  const blankOnly = candidate.trim().length === 0;
  if (blankOnly) {
    problems.push("roast line is only whitespace");
  }
  const mentionsOwnAgent = candidate.includes("Nanoy");
  if (mentionsOwnAgent === false) {
    problems.push("roast line must name the agent it roasts");
  }
  const namesRealFailing =
    candidate.includes("guard-style") && candidate.includes("drand-anchored");
  if (namesRealFailing === false) {
    problems.push("roast line must name a real, specific failing");
  }
  const hasTurn = candidate.includes(ROAST_TURN_MARKER);
  if (hasTurn === false) {
    problems.push("roast line has no turn from setup to punchline");
  }
  const validation: RoastValidation = {
    valid: problems.length === 0,
    problems,
  };
  return validation;
}

function nayyyEnsureOutputDir(outputPath: string): void {
  const outputDir = dirname(outputPath);
  mkdirSync(outputDir, { recursive: true });
}

function nayyyWriteRoastEntry(
  outputPath: string,
  line: string,
): RoastWriteOutcome {
  nayyyEnsureOutputDir(outputPath);
  writeFileSync(outputPath, line, { encoding: "utf8" });
  const writtenBytes = Buffer.byteLength(line, "utf8");
  const outcome: RoastWriteOutcome = {
    written: true,
    path: outputPath,
    byteCount: writtenBytes,
  };
  return outcome;
}

function nayyyVerifyRoastEntry(
  outputPath: string,
  expectedLine: string,
): RoastVerifyOutcome {
  const readBack = readFileSync(outputPath, { encoding: "utf8" });
  const outcome: RoastVerifyOutcome = {
    matches: readBack === expectedLine,
    readBack,
  };
  return outcome;
}

function nayyyReportProblems(problems: string[]): void {
  for (const problem of problems) {
    console.error("roast check failed: " + problem);
  }
}

function nayyyRunRoastEntry(): number {
  const clauses = [
    ROAST_SUBJECT_CLAUSE,
    ROAST_EFFORT_CLAUSE,
    ROAST_PUNCH_CLAUSE,
  ];
  const assembly = nayyyAssembleRoastLine(clauses);
  const expectedClauseCount = 3;
  const clauseMismatch = assembly.clauseCount !== expectedClauseCount;
  if (clauseMismatch) {
    console.error(
      "roast assembly dropped a clause: got " +
        String(assembly.clauseCount) +
        ", want " +
        String(expectedClauseCount),
    );
    const failureCode = 1;
    return failureCode;
  }
  const validation = nayyyValidateRoastLine(assembly.line);
  if (validation.valid === false) {
    nayyyReportProblems(validation.problems);
    const invalidCode = 1;
    return invalidCode;
  }
  const writeOutcome = nayyyWriteRoastEntry(
    ROAST_OUTPUT_PATH,
    assembly.line,
  );
  const verifyOutcome = nayyyVerifyRoastEntry(
    ROAST_OUTPUT_PATH,
    assembly.line,
  );
  if (verifyOutcome.matches === false) {
    console.error(
      "roast read-back mismatch: file holds " +
        JSON.stringify(verifyOutcome.readBack),
    );
    const mismatchCode = 1;
    return mismatchCode;
  }
  console.log(
    "roast written: " +
      String(writeOutcome.byteCount) +
      " bytes to " +
      writeOutcome.path,
  );
  console.log(assembly.line);
  const successCode = 0;
  return successCode;
}

process.exitCode = nayyyRunRoastEntry();
