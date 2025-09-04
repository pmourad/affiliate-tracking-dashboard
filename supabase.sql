-- Harold's Smart Redirect - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clicks table for tracking affiliate link clicks
CREATE TABLE IF NOT EXISTS clicks (
    -- Primary key and metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Required tracking parameters (normalized to kebab-case)
    client TEXT NOT NULL,
    service TEXT NOT NULL,
    industry TEXT NOT NULL,
    channel TEXT NOT NULL,
    
    -- Optional campaign and affiliate info
    campaign TEXT,
    aff TEXT NOT NULL DEFAULT 'harold',
    
    -- Unique click identifier and destination
    click_id UUID NOT NULL UNIQUE,
    dest_url TEXT NOT NULL,
    
    -- Request metadata (for analytics)
    referer TEXT,
    user_agent TEXT,
    country TEXT, -- Future: can be populated from IP geolocation
    
    -- Privacy-safe IP hash (never store raw IP)
    ip_hash TEXT
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_clicks_client ON clicks(client);
CREATE INDEX IF NOT EXISTS idx_clicks_channel ON clicks(channel);
CREATE INDEX IF NOT EXISTS idx_clicks_click_id ON clicks(click_id);
CREATE INDEX IF NOT EXISTS idx_clicks_aff ON clicks(aff);

-- Create composite index for admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_clicks_date_client ON clicks(created_at, client);
CREATE INDEX IF NOT EXISTS idx_clicks_date_channel ON clicks(created_at, channel);

-- Add some helpful comments
COMMENT ON TABLE clicks IS 'Tracks affiliate link clicks with privacy-safe hashed IPs';
COMMENT ON COLUMN clicks.click_id IS 'Unique identifier passed to destination URL';
COMMENT ON COLUMN clicks.ip_hash IS 'SHA-256 hash of IP + salt, never store raw IP';
COMMENT ON COLUMN clicks.aff IS 'Affiliate identifier, defaults to harold';

-- Optional: Create a view for recent clicks (last 30 days)
CREATE OR REPLACE VIEW recent_clicks AS
SELECT *
FROM clicks
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Optional: Create a function to get click stats
CREATE OR REPLACE FUNCTION get_click_stats(
    start_date DATE DEFAULT (NOW() - INTERVAL '30 days')::DATE,
    end_date DATE DEFAULT NOW()::DATE
)
RETURNS TABLE (
    total_clicks BIGINT,
    unique_clients BIGINT,
    unique_channels BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_clicks,
        COUNT(DISTINCT client) as unique_clients,
        COUNT(DISTINCT channel) as unique_channels
    FROM clicks
    WHERE created_at::DATE BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Harold''s Smart Redirect database schema created successfully!';
    RAISE NOTICE 'Tables: clicks';
    RAISE NOTICE 'Indexes: created_at, client, channel, click_id, aff';
    RAISE NOTICE 'Views: recent_clicks';
    RAISE NOTICE 'Functions: get_click_stats()';
END $$;
