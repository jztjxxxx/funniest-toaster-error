// The Funniest Toaster Error Message — make.fun entry.
// A tiny Node program that writes one toaster error line to
// <output dir>/entry.txt (UTF-8, no trailing newline).
// Node 22, standard library only, no network, no input files.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself: the message this toaster shows when the bread
// goes in and simply never comes back out.
const MESSAGE =
  "Error 404: Bread not found. It went in. It never came out. Please do not open the toaster and ask it questions.";

const MAX_CHARS = 120;

function checkLine(text: string): number {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return chars;
}

const count = checkLine(MESSAGE);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, MESSAGE, "utf8");

// Read the file back and confirm the bytes on disk are exactly the
// message intended: same text, same length, nothing added.
const onDisk = readFileSync(target, "utf8");
if (onDisk !== MESSAGE) {
  throw new Error("entry.txt on disk does not match the intended message");
}
const digest = createHash("sha256").update(onDisk, "utf8").digest("hex");
console.log(`wrote entry.txt (${count} characters, sha256 ${digest})`);
