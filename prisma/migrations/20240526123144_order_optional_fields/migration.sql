-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "number" TEXT,
    "complement" TEXT,
    "zipCode" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("address", "city", "complement", "cpf", "createdAt", "email", "id", "name", "neighborhood", "number", "phone", "state", "status", "total", "updatedAt", "zipCode") SELECT "address", "city", "complement", "cpf", "createdAt", "email", "id", "name", "neighborhood", "number", "phone", "state", "status", "total", "updatedAt", "zipCode" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_key_check("Order");
PRAGMA foreign_keys=ON;
