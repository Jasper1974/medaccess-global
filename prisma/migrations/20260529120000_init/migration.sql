-- CreateTable
CREATE TABLE "ClinicalTrial" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleCn" TEXT,
    "diseaseSlugs" TEXT[],
    "diseaseLabel" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "locations" TEXT[],
    "eligibility" TEXT NOT NULL DEFAULT '',
    "summary" TEXT NOT NULL DEFAULT '',
    "intervention" TEXT NOT NULL DEFAULT '',
    "sponsor" TEXT NOT NULL DEFAULT '',
    "contactInfo" TEXT NOT NULL DEFAULT '',
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "freeLabel" TEXT,
    "crawledAt" TIMESTAMP(3) NOT NULL,
    "recruitmentEndDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalTrial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "navigationDiseaseSlug" TEXT,
    "conditionSummary" TEXT,
    "documentedDiagnosis" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "sentToUserAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalTrial_sourceId_key" ON "ClinicalTrial"("sourceId");

-- CreateIndex
CREATE INDEX "ClinicalTrial_status_idx" ON "ClinicalTrial"("status");

-- CreateIndex
CREATE INDEX "ClinicalTrial_crawledAt_idx" ON "ClinicalTrial"("crawledAt" DESC);
