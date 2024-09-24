import { createStore } from 'libs/store/createStore'

export type UserAchievement = {
  id: string
  completedAt: Date
}

type State = {
  completedAchievements: UserAchievement[]
}

const actions = (set: (payload: State) => void) => ({
  setCompletedAchievements: (completedAchievements: UserAchievement[]) =>
    set({ completedAchievements }),
})
type AchievementsActions = ReturnType<typeof actions>

export const userAchievementsStore = createStore<State, AchievementsActions>(
  'user-achievements',
  {
    completedAchievements: [],
  },
  actions
)
