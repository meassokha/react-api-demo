import { useEffect, useState } from 'react'

// Generic hook: runs `fetcher(signal)` whenever `deps` change and tracks the
// three states every API call has - loading, error, data.
export function useApi(fetcher, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true })

  useEffect(() => {
    // AbortController cancels the in-flight request if the component unmounts
    // or deps change first (prevents stale responses overwriting new ones).
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))

    fetcher(controller.signal)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name === 'AbortError') return // expected on cleanup
        setState({ data: null, error, loading: false })
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
