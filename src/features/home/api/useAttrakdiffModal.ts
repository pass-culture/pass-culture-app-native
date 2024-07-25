export type Attrakdiff = {
  hasTriggered: () => Promise<boolean>
  setTriggered: () => Promise<void>
}

const NB_OF_SCREEN_SEEN = 5
export const useAttrakdiffModal = ({
  onTrigger,
  screenHeight,
  attrakdiff,
  isLoggedIn,
}: {
  screenHeight: number
  onTrigger: () => Promise<void>
  attrakdiff: Attrakdiff
  isLoggedIn: boolean
}) => ({
  checkTrigger: async (currentScrollPosition: number) => {
    if (!isLoggedIn) return
    const hasNotSeenEnoughContent = screenHeight * NB_OF_SCREEN_SEEN > currentScrollPosition
    const hasAlreadySeenAttrakdiff = await attrakdiff.hasTriggered()

    if (hasNotSeenEnoughContent || hasAlreadySeenAttrakdiff) {
      return
    }
    onTrigger()
    await attrakdiff.setTriggered()
  },
})
