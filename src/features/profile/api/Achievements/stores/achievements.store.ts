import { createStore } from 'libs/store/createStore'

export type Achievement = {
  id: string
  name: string
  description: string
  category: string
  icon: string
}

type State = {
  achievements: Achievement[]
}

const actions = (set: (payload: State) => void) => ({
  setAchievements: (achievements: Achievement[]) => set({ achievements }),
})
type AchievementsActions = ReturnType<typeof actions>

export const achievementsStore = createStore<State, AchievementsActions>(
  'achievements',
  {
    achievements: [],
  },
  actions
)
