CREATE TABLE "teachers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "achievements" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "courses" ADD COLUMN "teacherId" INTEGER;

ALTER TABLE "courses" ADD CONSTRAINT "courses_teacherId_fkey"
FOREIGN KEY ("teacherId") REFERENCES "teachers"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
