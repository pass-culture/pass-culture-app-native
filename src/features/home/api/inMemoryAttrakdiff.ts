import { Attrakdiff } from './useAttrakdiffModal'

export const createInMemoryAttrakdiff = (): Attrakdiff => {
  let hasTriggered = false
  return {
    hasTriggered: async () => hasTriggered,
    setTriggered: async () => {
      hasTriggered = true
    },
  }
}
