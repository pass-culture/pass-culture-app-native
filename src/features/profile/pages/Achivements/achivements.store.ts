import { createStore } from 'libs/store/createStore'

export type Achievement = {
  id: string
  name: string
  description: string
  category: string
  icon: string
}

const achievements: Achievement[] = [
  {
    id: 'FIRST_ADD_FAVORITE',
    name: 'First favorite',
    description: 'Add your first favorite',
    category: 'Favorites',
    icon: 'Info',
  },
]

type State = {
  achievements: Achievement[]
}

const actions = () => ({})
type AchievementsActions = ReturnType<typeof actions>

export const achievementsStore = createStore<State, AchievementsActions>(
  'achievements',
  {
    achievements,
  },
  actions
)
