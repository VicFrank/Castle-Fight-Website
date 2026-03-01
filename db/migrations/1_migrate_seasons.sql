-- Migration: Add seasons and season_placements tables
-- Run this against an existing database instead of re-running init.sql

CREATE TABLE IF NOT EXISTS seasons (
  season_id SERIAL PRIMARY KEY,
  season_number INT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL DEFAULT Now()
);

CREATE TABLE IF NOT EXISTS season_placements (
  season_id INTEGER REFERENCES seasons (season_id) ON UPDATE CASCADE,
  player_id INTEGER REFERENCES players (player_id) ON UPDATE CASCADE,
  final_mmr INT NOT NULL,
  rank INT NOT NULL,
  CONSTRAINT season_placements_pkey PRIMARY KEY (season_id, player_id)
);

CREATE INDEX IF NOT EXISTS ix_season_placements_player_id ON season_placements (player_id);
