// All talking to the third-party API lives here, so components stay UI-only.
// PokeAPI is free, needs no API key, and allows cross-origin (CORS) requests
// from the browser - ideal for learning.
const BASE_URL = 'https://pokeapi.co/api/v2'

// Shared helper: fetch() only rejects on network failure, NOT on 404/500,
// so we check `response.ok` ourselves and throw a readable error.
async function getJson(path, signal) {
  const response = await fetch(`${BASE_URL}${path}`, { signal })
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

// GET /pokemon?limit=24&offset=0  ->  { count, results: [{ name, url }] }
export function listPokemon({ limit = 24, offset = 0 }, signal) {
  return getJson(`/pokemon?limit=${limit}&offset=${offset}`, signal)
}

// GET /pokemon/{name or id}  ->  full details
export function getPokemon(nameOrId, signal) {
  return getJson(`/pokemon/${encodeURIComponent(nameOrId.toLowerCase())}`, signal)
}
