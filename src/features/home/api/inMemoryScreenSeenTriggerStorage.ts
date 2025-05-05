import { ScreenSeenCount, ScreenSeenCountTriggerStorage } from './getScreenSeenCount'

export const createInMemoryScreenSeenCountTriggerStorage = (): ScreenSeenCountTriggerStorage => {
  const triggered: number[] = []

  return {
    hasTriggered: async (screenSeenCount: ScreenSeenCount) => triggered.includes(screenSeenCount),
    setTriggered: async (screenSeenCount: ScreenSeenCount) => {
      triggered.push(screenSeenCount)
    },
  }
}
