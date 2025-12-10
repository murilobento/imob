-- Add CRECI column to company_settings table
ALTER TABLE company_settings ADD COLUMN IF NOT EXISTS creci VARCHAR(50);
