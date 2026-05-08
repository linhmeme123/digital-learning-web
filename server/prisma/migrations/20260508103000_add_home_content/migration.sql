CREATE TABLE "home_contents" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroSlides" JSONB NOT NULL,
    "introductionTitle" TEXT NOT NULL,
    "introductionBody" JSONB NOT NULL,
    "achievements" JSONB NOT NULL,
    "mission" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "coreValues" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_contents_pkey" PRIMARY KEY ("id")
);
