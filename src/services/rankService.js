// src/services/rankService.js
const axios = require("axios");

const RANK_API_URL =
  process.env.RANK_API_URL ||
  "https://api.fifa.com/api/v3/ranking/latest?locale=en";

const RANK_CACHE_TTL = Number(process.env.RANK_CACHE_TTL || 86400); // 24h
const RANK_USE_MOCK = String(process.env.RANK_USE_MOCK || "false").toLowerCase() === "true";

let rankCache = { ts: 0, map: null };
const fresh = (ts) => Date.now() - ts < RANK_CACHE_TTL * 1000;

function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

// Alias de países (variantes comunes)
const ALIASES = {
  "estados unidos": ["united states", "usa", "u.s.a."],
  mexico: ["méxico", "mexico"],
  inglaterra: ["england"],
  españa: ["spain", "espana"],
  japon: ["japan"],
  "corea del sur": ["korea republic", "south korea", "corea republica"],
  "arabia saudita": ["saudi arabia"],
  catar: ["qatar"],
  brasil: ["brazil"],
  "costa de marfil": ["cote d'ivoire", "ivory coast", "cote divoire"],
};

// Mock estable (Top 15 aprox.)
const MOCK_TOP15 = {
  argentina: 1,
  francia: 2,
  france: 2,
  inglaterra: 3,
  england: 3,
  belgica: 4,
  belgium: 4,
  brasil: 5,
  brazil: 5,
  "paises bajos": 6,
  netherlands: 6,
  portugal: 7,
  españa: 8,
  spain: 8,
  italia: 9,
  italy: 9,
  croacia: 10,
  croatia: 10,
  estadosunidos: 11,
  "estados unidos": 11,
  usa: 11,
  colombia: 12,
  mexico: 13,
  uruguay: 14,
  marruecos: 15,
  morocco: 15,
};

function addAliasesToMap(map, name, rank) {
  const key = normalize(name);
  if (!map[key]) map[key] = rank;
  const alt = ALIASES[key];
  if (alt) {
    alt.forEach((a) => {
      const ak = normalize(a);
      if (!map[ak]) map[ak] = rank;
    });
  }
}

async function fetchFifaRankMap() {
  const { data } = await axios.get(RANK_API_URL, { timeout: 10000 });
  const rows = data?.Rankings || data?.rankings || data?.results || [];
  const out = {};
  for (const row of rows) {
    const name =
      row?.TeamName ||
      row?.Team?.Name ||
      row?.CountryName ||
      row?.TeamEn ||
      row?.Name ||
      row?.teamName;
    const rank = Number(row?.Rank ?? row?.rank);
    if (!name || !rank) continue;
    addAliasesToMap(out, name, rank);
  }
  return out;
}

function mockRankMap() {
  return { ...MOCK_TOP15 };
}

async function getFifaRankMap() {
  if (rankCache.map && fresh(rankCache.ts)) return rankCache.map;

  // Si se pide mock explícito, se usa directamente
  if (RANK_USE_MOCK) {
    const map = mockRankMap();
    rankCache = { ts: Date.now(), map };
    return map;
  }

  // Sin try/catch: simplemente ejecuta y si falla axios, propagará el error
  const map = await fetchFifaRankMap();

  // Si por alguna razón la API devuelve vacío, usamos mock
  const finalMap = Object.keys(map).length ? map : mockRankMap();
  rankCache = { ts: Date.now(), map: finalMap };
  return finalMap;
}

async function getTeamRank(teamName) {
  if (!teamName) return null;
  const map = await getFifaRankMap();
  const key = normalize(teamName);
  return map[key] ?? map[key.replace(/\s+/g, "")] ?? null;
}

module.exports = { getTeamRank, getFifaRankMap };
