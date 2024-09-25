export const createFakeAchievementNotifier = () => {
  let lastNotifyWith: string | undefined
  return {
    notify: (achievementId: string) => {
      lastNotifyWith = achievementId
    },
    getLastNotifyWith: () => lastNotifyWith,
  }
}
