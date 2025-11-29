-- Migration script to update contract type enum values
-- Run this on your Raspberry Pi's PostgreSQL database

-- First, create a new enum type with the correct values
CREATE TYPE contract_type_new AS ENUM (
  'target_infiltration',
  'data_extraction', 
  'account_takeover',
  'network_breach'
);

-- Update existing contracts to use new values (map old to new)
UPDATE contracts SET type = 'target_infiltration' WHERE type::text = 'infiltration';
UPDATE contracts SET type = 'data_extraction' WHERE type::text = 'extraction';
UPDATE contracts SET type = 'target_infiltration' WHERE type::text = 'audit';
UPDATE contracts SET type = 'network_breach' WHERE type::text = 'ddos';
UPDATE contracts SET type = 'account_takeover' WHERE type::text = 'recovery';

-- Alter the column to use the new type
ALTER TABLE contracts 
  ALTER COLUMN type TYPE contract_type_new 
  USING type::text::contract_type_new;

-- Drop the old enum and rename the new one
DROP TYPE IF EXISTS contract_type;
ALTER TYPE contract_type_new RENAME TO contract_type;
