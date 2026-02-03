-- Required extension
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Add booking time range
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS time_slot tstzrange;

-- Backfill existing bookings (assume 2-hour duration for old data)
UPDATE bookings
SET time_slot =
  tstzrange(
    bookings.date::timestamp + bookings.time::time,
    bookings.date::timestamp + bookings.time::time + INTERVAL '2 hours',
    '[)'
  )
WHERE time_slot IS NULL;

-- Make NOT NULL after backfill
ALTER TABLE bookings
ALTER COLUMN time_slot SET NOT NULL;

-- Prevent overlapping bookings
ALTER TABLE bookings
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  time_slot WITH &&
)
WHERE (status IN ('pending', 'confirmed'));
