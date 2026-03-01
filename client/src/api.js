const BASE_URL = "/api";

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export default {
  // Leaderboard
  getLeaderboard() {
    return request("/leaderboard/");
  },

  // Games
  getRecentGames() {
    return request("/games/");
  },
  getGame(gameId) {
    return request(`/games/${gameId}`);
  },
  getGameRounds(gameId) {
    return request(`/games/${gameId}/rounds`);
  },
  getNumPlayerRounds(hours) {
    return request(`/games/records/num_player_rounds?hours=${hours}`);
  },

  // Players
  getPlayer(steamId) {
    return request(`/players/${steamId}`);
  },
  getPlayerGames(steamId) {
    return request(`/players/${steamId}/games`);
  },
  getPlayerRaces(steamId) {
    return request(`/players/${steamId}/races`);
  },
  getPlayerRaceBuildings(steamId, race) {
    return request(`/players/${steamId}/races/${race}`);
  },
  getPlayerBuildings(steamId) {
    return request(`/players/${steamId}/buildings`);
  },
  getPlayerSeasons(steamId) {
    return request(`/players/${steamId}/seasons`);
  },
  searchPlayers(username) {
    return request(`/players/search/${encodeURIComponent(username)}`);
  },

  // Races
  getRaces(hours) {
    return request(`/races?hours=${hours}`);
  },
  getRace(race, hours) {
    return request(`/races/${race}?hours=${hours}`);
  },
  getRaceAllBuildings(race, hours) {
    return request(`/races/${race}/all_buildings?hours=${hours}`);
  },
  getRaceFirstBuildings(race, hours) {
    return request(`/races/${race}/first_buildings?hours=${hours}`);
  },
};
