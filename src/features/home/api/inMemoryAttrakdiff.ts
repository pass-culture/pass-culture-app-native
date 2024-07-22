import { Attrakdiff } from './useAttrakdiffModal'

export type InMemoryAttrakdiff = ReturnType<typeof createInMemoryAttrakdiff>

export const createInMemoryAttrakdiff = (): Attrakdiff => {
  let hasTriggered = false
  return {
    hasTriggered: async () => hasTriggered,
    setTriggered: async () => {
      hasTriggered = true
    },
  }
}
