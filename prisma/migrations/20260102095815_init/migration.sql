-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ShortLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortCode" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "userId" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ShortLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortLinkId" TEXT NOT NULL,
    "clickedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,
    "referrerHost" TEXT,
    "source" TEXT,
    "userAgentRaw" TEXT,
    "deviceType" TEXT,
    "os" TEXT,
    "browser" TEXT,
    "country" TEXT,
    "city" TEXT,
    "ipHash" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ClickEvent_shortLinkId_fkey" FOREIGN KEY ("shortLinkId") REFERENCES "ShortLink" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShortLink_shortCode_key" ON "ShortLink"("shortCode");

-- CreateIndex
CREATE INDEX "ShortLink_shortCode_idx" ON "ShortLink"("shortCode");

-- CreateIndex
CREATE INDEX "ShortLink_userId_idx" ON "ShortLink"("userId");

-- CreateIndex
CREATE INDEX "ShortLink_createdAt_idx" ON "ShortLink"("createdAt");

-- CreateIndex
CREATE INDEX "ClickEvent_shortLinkId_idx" ON "ClickEvent"("shortLinkId");

-- CreateIndex
CREATE INDEX "ClickEvent_clickedAt_idx" ON "ClickEvent"("clickedAt");

-- CreateIndex
CREATE INDEX "ClickEvent_shortLinkId_clickedAt_idx" ON "ClickEvent"("shortLinkId", "clickedAt");

-- CreateIndex
CREATE INDEX "ClickEvent_source_idx" ON "ClickEvent"("source");

-- CreateIndex
CREATE INDEX "ClickEvent_deviceType_idx" ON "ClickEvent"("deviceType");

-- CreateIndex
CREATE INDEX "ClickEvent_country_idx" ON "ClickEvent"("country");
