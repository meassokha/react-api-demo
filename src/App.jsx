import { useState } from 'react'
import { listPokemon, getPokemon } from './api.js'
import { useApi } from './hooks/useApi.js'

const PAGE_SIZE = 24

export default function App() {
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState(null) // name of the Pokemon to show
  const [query, setQuery] = useState('')

  // 1) Fetch a page of the list. Re-runs whenever `page` changes.
  const list = useApi(
    (signal) => listPokemon({ limit: PAGE_SIZE, offset: page * PAGE_SIZE }, signal),
    [page],
  )

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) setSelected(query.trim())
  }

  const totalPages = list.data ? Math.ceil(list.data.count / PAGE_SIZE) : 0

  return (
    <main className="app">
      <h1>Pokedex</h1>
      <p className="sub">
        A learning demo: React calling the public <code>pokeapi.co</code> REST API.
      </p>

      <form onSubmit={handleSearch} className="search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or number, e.g. pikachu"
          aria-label="Search Pokemon"
        />
        <button type="submit">Search</button>
      </form>

      {selected && <Details name={selected} onClose={() => setSelected(null)} />}

      {list.loading && <p className="status">Loading...</p>}
      {list.error && <p className="status error">Error: {list.error.message}</p>}

      {list.data && (
        <>
          <ul className="grid">
            {list.data.results.map((p) => (
              <li key={p.name}>
                <button onClick={() => setSelected(p.name)}>{p.name}</button>
              </li>
            ))}
          </ul>

          <nav className="pager">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              &larr; Prev
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next &rarr;
            </button>
          </nav>
        </>
      )}
    </main>
  )
}

// 2) A second request, fired whenever `name` changes.
function Details({ name, onClose }) {
  const { data, error, loading } = useApi((signal) => getPokemon(name, signal), [name])

  return (
    <section className="card">
      <button className="close" onClick={onClose} aria-label="Close details">
        &times;
      </button>
      {loading && <p className="status">Loading {name}...</p>}
      {error && (
        <p className="status error">
          Could not load "{name}". {error.message}
        </p>
      )}
      {data && (
        <>
          <img src={data.sprites.other['official-artwork'].front_default} alt={data.name} />
          <h2>
            #{data.id} {data.name}
          </h2>
          <p>
            Types: {data.types.map((t) => t.type.name).join(', ')} &middot; Height:{' '}
            {data.height / 10} m &middot; Weight: {data.weight / 10} kg
          </p>
          <ul className="stats">
            {data.stats.map((s) => (
              <li key={s.stat.name}>
                <span>{s.stat.name}</span>
                <meter min="0" max="150" value={s.base_stat} />
                <b>{s.base_stat}</b>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
