export async function register() {
  // Next.js 15.3.x dev overlay imports user-preferences module server-side
  // which calls localStorage.getItem. Polyfill it so SSR doesn't crash.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    if (
      typeof globalThis.localStorage === 'undefined' ||
      typeof (globalThis.localStorage as Storage | undefined)?.getItem !== 'function'
    ) {
      const _store: Record<string, string> = {}
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: (key: string) => _store[key] ?? null,
          setItem: (key: string, val: string) => { _store[key] = val },
          removeItem: (key: string) => { delete _store[key] },
          clear: () => { Object.keys(_store).forEach((k) => delete _store[k]) },
          get length() { return Object.keys(_store).length },
          key: (i: number) => Object.keys(_store)[i] ?? null,
        } as Storage,
        writable: true,
        configurable: true,
      })
    }
  }
}
