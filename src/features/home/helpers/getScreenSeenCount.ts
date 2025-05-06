export type ScreenSeenCount = 3 | 5
export type ScreenSeenCountTriggerStorage = {
  hasTriggered: (screenSeenCount: ScreenSeenCount) => Promise<boolean>
  setTriggered: (screenSeenCount: ScreenSeenCount) => Promise<void>
}

export const getScreenSeenCount = ({
  onTrigger,
  screenHeight,
  triggerStorage,
  isLoggedIn,
}: {
  screenHeight: number
  onTrigger: (screenSeenCount: ScreenSeenCount) => Promise<void>
  triggerStorage: ScreenSeenCountTriggerStorage
  isLoggedIn: boolean
}) => {
  const screenSeenCountTrigger =
    (screenSeenCount: ScreenSeenCount) => async (currentScrollPosition: number) => {
      const hasSeenScreenCount = screenHeight * screenSeenCount <= currentScrollPosition
      const hasNotAlreadySeenScreen = !(await triggerStorage.hasTriggered(screenSeenCount))

      if (hasSeenScreenCount && hasNotAlreadySeenScreen) {
        onTrigger(screenSeenCount)
        await triggerStorage.setTriggered(screenSeenCount)
      }
    }

  return {
    checkTrigger: async (currentScrollPosition: number) => {
      if (!isLoggedIn) return

      await screenSeenCountTrigger(3)(currentScrollPosition)
      await screenSeenCountTrigger(5)(currentScrollPosition)
    },
  }
}
