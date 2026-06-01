#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { syncClinicalTrials } from "../lib/trials/sync-clinicaltrials";

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local is optional for dry-run
  }
}

function parseArgs(argv: string[]) {
  const diseaseArg = argv.find((arg) => arg.startsWith("--disease="));
  return {
    dryRun: argv.includes("--dry-run"),
    skipTranslate: argv.includes("--skip-translate"),
    diseaseSlug: diseaseArg?.split("=")[1],
    help: argv.includes("--help") || argv.includes("-h"),
  };
}

async function main() {
  loadEnvLocal();

  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage:
  npm run sync:trials [-- --dry-run]
  npm run sync:trials -- --disease=fei-ai-egfr
  npm run sync:trials -- --dry-run --disease=sma
  npm run sync:trials -- --skip-translate --disease=sma

Requires DATABASE_URL in .env.local unless --dry-run is used.
Set OPENAI_API_KEY to auto-translate English trials into Chinese.`);
    return;
  }

  if (!args.dryRun && !process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL is not configured. Use --dry-run or set .env.local.");
  }

  console.log("[sync:trials] Starting ClinicalTrials.gov sync...");
  if (args.diseaseSlug) {
    console.log(`[sync:trials] Disease filter: ${args.diseaseSlug}`);
  }
  if (args.dryRun) {
    console.log("[sync:trials] Dry run — no database writes");
  }
  if (args.skipTranslate) {
    console.log("[sync:trials] Translation skipped");
  }

  const result = await syncClinicalTrials({
    diseaseSlug: args.diseaseSlug,
    dryRun: args.dryRun,
    skipTranslate: args.skipTranslate,
    pageSize: 25,
    maxPages: 2,
  });

  console.log(
    `[sync:trials] Done. fetched=${result.fetched} upserted=${result.upserted} skipped=${result.skipped}`,
  );

  if (result.errors.length > 0) {
    console.log("[sync:trials] Errors:");
    for (const error of result.errors.slice(0, 10)) {
      console.log(`  - ${error}`);
    }
    if (result.errors.length > 10) {
      console.log(`  ... and ${result.errors.length - 10} more`);
    }
  }
}

main().catch((error) => {
  console.error("[sync:trials] Failed:", error);
  process.exit(1);
});
