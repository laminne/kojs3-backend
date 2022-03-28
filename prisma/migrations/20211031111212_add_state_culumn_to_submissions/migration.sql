/*
  Warnings:

  - Added the required column `state` to the `Submissions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "submited_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tasksId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    FOREIGN KEY ("tasksId") REFERENCES "Tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Submissions" ("code", "id", "submited_at", "tasksId", "userId") SELECT "code", "id", "submited_at", "tasksId", "userId" FROM "Submissions";
DROP TABLE "Submissions";
ALTER TABLE "new_Submissions" RENAME TO "Submissions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
