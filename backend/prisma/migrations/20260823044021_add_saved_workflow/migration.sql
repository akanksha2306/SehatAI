-- CreateTable
CREATE TABLE "SavedWorkflow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "description" TEXT,
    "output" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedWorkflow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavedWorkflow" ADD CONSTRAINT "SavedWorkflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
