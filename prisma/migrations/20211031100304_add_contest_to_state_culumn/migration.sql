-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "starting_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Contest" ("descriptions", "end_time", "id", "starting_time", "title") SELECT "descriptions", "end_time", "id", "starting_time", "title" FROM "Contest";
DROP TABLE "Contest";
ALTER TABLE "new_Contest" RENAME TO "Contest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
