import { createStore } from 'libs/store/createStore'

export type UserAchievement = {
  id: string
  completedAt: Date
}

type State = {
  completedAchievements: UserAchievement[]
}

const actions = () => ({})
type AchievementsActions = ReturnType<typeof actions>

export const userAchievementsStore = createStore<State, AchievementsActions>(
  'user-achievements',
  {
    completedAchievements: [{ id: 'FIRST_ADD_FAVORITE', completedAt: new Date() }],
  },
  actions
)
