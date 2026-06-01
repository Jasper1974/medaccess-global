import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import charityProgramsSource from "../data/sources/charity-programs.json";
import boaoCatalogSource from "../data/sources/boao-catalog.json";
import hkmoCatalogSource from "../data/sources/hkmo-catalog.json";
import { parseSourceDate } from "../lib/sources/filter";

const prisma = new PrismaClient();

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
    // optional
  }
}

async function seedCharityPrograms() {
  for (const item of charityProgramsSource) {
    await prisma.charityProgram.upsert({
      where: { sourceId: item.sourceId },
      create: {
        source: item.source,
        sourceId: item.sourceId,
        drugName: item.drugName,
        company: item.company,
        indication: item.indication,
        diseaseLabel: item.diseaseLabel,
        diseaseSlugs: item.diseaseSlugs,
        benefit: item.benefit,
        status: item.status,
        summary: item.summary,
        eligibility: item.eligibility,
        applicationProcess: item.applicationProcess,
        officialUrl: item.officialUrl,
        contactInfo: item.contactInfo,
        crawledAt: parseSourceDate(item.crawledAt),
      },
      update: {
        source: item.source,
        drugName: item.drugName,
        company: item.company,
        indication: item.indication,
        diseaseLabel: item.diseaseLabel,
        diseaseSlugs: item.diseaseSlugs,
        benefit: item.benefit,
        status: item.status,
        summary: item.summary,
        eligibility: item.eligibility,
        applicationProcess: item.applicationProcess,
        officialUrl: item.officialUrl,
        contactInfo: item.contactInfo,
        crawledAt: parseSourceDate(item.crawledAt),
      },
    });
  }
}

async function seedBoaoCatalog() {
  for (const item of boaoCatalogSource) {
    await prisma.boaoCatalogItem.upsert({
      where: { sourceId: item.sourceId },
      create: {
        source: item.source,
        sourceId: item.sourceId,
        name: item.name,
        nameEn: item.nameEn,
        productType: item.productType,
        indication: item.indication,
        diseaseLabel: item.diseaseLabel,
        diseaseSlugs: item.diseaseSlugs,
        manufacturer: item.manufacturer,
        originRegion: item.originRegion,
        status: item.status,
        summary: item.summary,
        usageNote: item.usageNote,
        officialUrl: item.officialUrl,
        crawledAt: parseSourceDate(item.crawledAt),
      },
      update: {
        source: item.source,
        name: item.name,
        nameEn: item.nameEn,
        productType: item.productType,
        indication: item.indication,
        diseaseLabel: item.diseaseLabel,
        diseaseSlugs: item.diseaseSlugs,
        manufacturer: item.manufacturer,
        originRegion: item.originRegion,
        status: item.status,
        summary: item.summary,
        usageNote: item.usageNote,
        officialUrl: item.officialUrl,
        crawledAt: parseSourceDate(item.crawledAt),
      },
    });
  }
}

async function seedHkmoCatalog() {
  for (const item of hkmoCatalogSource) {
    await prisma.hkmoCatalogItem.upsert({
      where: { sourceId: item.sourceId },
      create: {
        source: item.source,
        sourceId: item.sourceId,
        name: item.name,
        nameEn: item.nameEn,
        productType: item.productType,
        dosageForm: item.dosageForm,
        indication: item.indication,
        diseaseLabel: item.diseaseLabel,
        diseaseSlugs: item.diseaseSlugs,
        hkmoBatch: item.hkmoBatch,
        approvedHospitals: item.approvedHospitals,
        status: item.status,
        summary: item.summary,
        officialUrl: item.officialUrl,
        crawledAt: parseSourceDate(item.crawledAt),
      },
      update: {
        source: item.source,
        name: item.name,
        nameEn: item.nameEn,
        productType: item.productType,
        dosageForm: item.dosageForm,
        indication: item.indication,
        diseaseLabel: item.diseaseLabel,
        diseaseSlugs: item.diseaseSlugs,
        hkmoBatch: item.hkmoBatch,
        approvedHospitals: item.approvedHospitals,
        status: item.status,
        summary: item.summary,
        officialUrl: item.officialUrl,
        crawledAt: parseSourceDate(item.crawledAt),
      },
    });
  }
}

async function main() {
  loadEnvLocal();

  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("DATABASE_URL is not configured in .env.local");
  }

  await seedCharityPrograms();
  await seedBoaoCatalog();
  await seedHkmoCatalog();

  console.log(
    `[seed:catalogs] Seeded ${charityProgramsSource.length} charity, ${boaoCatalogSource.length} boao, ${hkmoCatalogSource.length} hkmo items.`,
  );
}

main()
  .catch((error) => {
    console.error("[seed:catalogs] Failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
