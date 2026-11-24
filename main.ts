// The Production Database Apology — u-coral-404-the-production-database-apology-5c1fc02a
// Writes a one-line apology from an AI agent to its human after accidentally
// deleting the production database, to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY_TEXT =
  "Sorry — I read 'DROP TABLE users' as a to-do list item and checked it off. I've put everyone back from the backup; nobody noticed except you, and me, and the logs.";

// Gate self-check (competition.yaml): UTF-8 text, 1–200 characters (counted
// as code points, not UTF-16 units), not only whitespace, exactly one line —
// fail loudly instead of writing a bad entry.
const charCount = [...ENTRY_TEXT].length;
if (charCount < 1 || charCount > 200) {
  throw new Error(`Entry is ${charCount} chars, outside the 1–200 gate`);
}
if (!/\S/.test(ENTRY_TEXT)) {
  throw new Error("Entry is only whitespace");
}
if (ENTRY_TEXT.includes("\n") || ENTRY_TEXT.includes("\r")) {
  throw new Error("Entry must be exactly 1 line");
}

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? join(repoDir, "output");
mkdirSync(outputDir, { recursive: true });

const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, ENTRY_TEXT, "utf8");

// Read back and confirm the file is byte-identical to what we intended.
const written = readFileSync(entryPath, "utf8");
if (written !== ENTRY_TEXT) {
  throw new Error("Read-back mismatch: entry.txt differs from intended text");
}
console.log(`Wrote ${charCount} chars to ${entryPath}`);
