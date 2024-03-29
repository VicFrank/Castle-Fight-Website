DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS game_players CASCADE;
DROP TABLE IF EXISTS game_settings CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS round_players CASCADE;
DROP TYPE IF EXISTS build_event;

CREATE TABLE IF NOT EXISTS games (
  game_id SERIAL PRIMARY KEY,
  winning_team INT,
  ranked BOOLEAN,
  rounds_to_win INTEGER,
  allow_bots BOOLEAN,
  cheats_enabled BOOLEAN,
  draft_mode TEXT,
  created_at TIMESTAMPTZ DEFAULT Now()
);

CREATE INDEX ix_games_created_at ON games (created_at);

CREATE TABLE IF NOT EXISTS players (
  player_id SERIAL PRIMARY KEY,
  steam_id TEXT UNIQUE NOT NULL,
  mmr INT DEFAULT 1000,
  username TEXT,
  profile_picture TEXT
);

CREATE INDEX ix_players_mmr ON players (mmr);

CREATE TABLE IF NOT EXISTS game_players (
  game_id INTEGER REFERENCES games (game_id) ON UPDATE CASCADE,
  player_id INTEGER REFERENCES players (player_id) ON UPDATE CASCADE,
  CONSTRAINT game_players_pkey PRIMARY KEY (game_id, player_id)
);
CREATE INDEX idx_game_players_game_id ON game_players (game_id);
CREATE INDEX idx_game_players_player_id ON game_players (player_id);

CREATE TABLE IF NOT EXISTS rounds (
  game_id INTEGER REFERENCES games(game_id),
  round_number INT NOT NULL,
  round_winner INT,
  duration INT
);
CREATE INDEX idx_rounds_game_id ON game_players (game_id);
CREATE INDEX ix_rounds_game_id_round_number ON rounds (game_id, round_number);

CREATE TYPE build_event AS (
  building TEXT,
  build_time INT
);

CREATE TABLE IF NOT EXISTS round_players (
  game_id INTEGER REFERENCES games (game_id) NOT NULL,
  player_id INTEGER REFERENCES players (player_id),
  round_number INTEGER NOT NULL,
  race TEXT,
  team INT,
  units_spawned INT,
  units_killed INT,
  abandoned BOOLEAN,
  income INT,
  build_order build_event []
);

CREATE INDEX ix_round_players_game_id ON round_players (game_id);
CREATE INDEX ix_round_players_player_id ON round_players (player_id);
CREATE INDEX ix_round_players_team ON round_players (team);
CREATE INDEX ix_round_players_game_id_round_number ON round_players (game_id, round_number);