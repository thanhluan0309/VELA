export type SceneEventDetail =
  | { type: 'shoe:progress'; progress: number }
  | { type: 'shoe:visible'; visible: boolean }

export function emitScene(detail: SceneEventDetail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('vela:scene', { detail }))
}

export function onScene(handler: (detail: SceneEventDetail) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<SceneEventDetail>).detail)
  window.addEventListener('vela:scene', listener)
  return () => window.removeEventListener('vela:scene', listener)
}
