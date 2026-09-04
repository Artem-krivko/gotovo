CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "service" TEXT,
    "budget" TEXT,
    "deadline" TEXT,
    "attributionJson" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "disqualificationReason" TEXT,
    "qualifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
