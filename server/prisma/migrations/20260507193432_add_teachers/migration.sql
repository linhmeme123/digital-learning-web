-- This migration was generated before the migration that creates "teachers".
-- Keep it safe for shadow database replays; the actual column definition is
-- handled in 20260508090000_add_teachers.
ALTER TABLE IF EXISTS "teachers" ALTER COLUMN "achievements" DROP DEFAULT;
