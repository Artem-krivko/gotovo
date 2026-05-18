-- CreateTable
CREATE TABLE "Design" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "designId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_designId_fkey" FOREIGN KEY ("designId") REFERENCES "Design" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
