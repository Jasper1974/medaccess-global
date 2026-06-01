-- CreateTable
CREATE TABLE "CharityProgram" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "indication" TEXT NOT NULL,
    "diseaseLabel" TEXT NOT NULL,
    "diseaseSlugs" TEXT[],
    "benefit" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "eligibility" TEXT NOT NULL DEFAULT '',
    "applicationProcess" TEXT NOT NULL DEFAULT '',
    "officialUrl" TEXT,
    "contactInfo" TEXT NOT NULL DEFAULT '',
    "crawledAt" TIMESTAMP(3) NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CharityProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoaoCatalogItem" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "productType" TEXT NOT NULL,
    "indication" TEXT NOT NULL,
    "diseaseLabel" TEXT NOT NULL,
    "diseaseSlugs" TEXT[],
    "manufacturer" TEXT,
    "originRegion" TEXT,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "usageNote" TEXT NOT NULL DEFAULT '',
    "officialUrl" TEXT,
    "crawledAt" TIMESTAMP(3) NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoaoCatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HkmoCatalogItem" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "productType" TEXT NOT NULL,
    "dosageForm" TEXT,
    "indication" TEXT NOT NULL,
    "diseaseLabel" TEXT NOT NULL,
    "diseaseSlugs" TEXT[],
    "hkmoBatch" TEXT,
    "approvedHospitals" TEXT[],
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "officialUrl" TEXT,
    "crawledAt" TIMESTAMP(3) NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HkmoCatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharityProgram_sourceId_key" ON "CharityProgram"("sourceId");

-- CreateIndex
CREATE INDEX "CharityProgram_status_idx" ON "CharityProgram"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BoaoCatalogItem_sourceId_key" ON "BoaoCatalogItem"("sourceId");

-- CreateIndex
CREATE INDEX "BoaoCatalogItem_status_idx" ON "BoaoCatalogItem"("status");

-- CreateIndex
CREATE INDEX "BoaoCatalogItem_productType_idx" ON "BoaoCatalogItem"("productType");

-- CreateIndex
CREATE UNIQUE INDEX "HkmoCatalogItem_sourceId_key" ON "HkmoCatalogItem"("sourceId");

-- CreateIndex
CREATE INDEX "HkmoCatalogItem_status_idx" ON "HkmoCatalogItem"("status");

-- CreateIndex
CREATE INDEX "HkmoCatalogItem_productType_idx" ON "HkmoCatalogItem"("productType");
