/*
  Warnings:

  - Added the required column `compileErrorMessage` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `compilerMessage` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "execTime" INTEGER NOT NULL,
    "memoryUsage" INTEGER NOT NULL,
    "output" TEXT NOT NULL,
    "compileErrorMessage" TEXT NOT NULL,
    "compilerMessage" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    CONSTRAINT "Submission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Submission" ("code", "contestId", "contestantId", "execTime", "id", "language", "memoryUsage", "output", "point", "problemId", "status") SELECT "code", "contestId", "contestantId", "execTime", "id", "language", "memoryUsage", "output", "point", "problemId", "status" FROM "Submission";
DROP TABLE "Submission";
ALTER TABLE "new_Submission" RENAME TO "Submission";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
