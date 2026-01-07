-- Migration: Initial Recordings Table
-- TASK15 - Database Integration
-- DashkaRecord v2.0.0-alpha
-- Created: 2026-01-07

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create recordings table
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  filename VARCHAR(255) NOT NULL,
  
  -- File paths (local disk or mounted volume)
  webm_path TEXT NOT NULL,
  mp4_path TEXT,
  transcript_path TEXT,
  subtitles_path TEXT,
  
  -- Metadata
  file_size_bytes BIGINT,
  duration_seconds INTEGER,
  language VARCHAR(10),
  language_confidence FLOAT,
  
  -- Processing state
  status VARCHAR(50) NOT NULL DEFAULT 'uploaded',
  processing_step VARCHAR(100),
  processing_message TEXT,
  
  -- Flags
  translated BOOLEAN NOT NULL DEFAULT false,
  synced BOOLEAN NOT NULL DEFAULT false,
  
  -- Errors
  error_step VARCHAR(100),
  error_message TEXT,
  error_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_recordings_created_at ON recordings(created_at);
CREATE INDEX idx_recordings_status ON recordings(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recordings_updated_at
  BEFORE UPDATE ON recordings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE recordings IS 'DashkaRecord screen recordings metadata';
