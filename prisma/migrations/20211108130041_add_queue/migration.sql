-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'Running',
    "submissionId" TEXT NOT NULL,
    "hqId" TEXT NOT NULL,
    FOREIGN KEY ("submissionId") REFERENCES "Submissions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Queue.hqId_unique" ON "Queue"("hqId");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_submissionId_unique" ON "Queue"("submissionId");
