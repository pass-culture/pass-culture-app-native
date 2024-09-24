import { AchievementGateway } from 'features/profile/api/Achievements/AchievementGateway'
import { Achievement } from 'features/profile/api/Achievements/achievements.store'

const achievements: Achievement[] = [
  {
    id: 'FIRST_ADD_FAVORITE',
    name: 'First favorite',
    description: 'Add your first favorite',
    category: 'Favorites',
    icon: 'Profile',
  },
  {
    id: 'SECOND_ADD_FAVORITE',
    name: 'Second favorite',
    description: 'Add your second favorite',
    category: 'Favorites',
    icon: 'Profile',
  },
  {
    id: 'THIRD_ADD_FAVORITE',
    name: 'Third favorite',
    description: 'Add your third favorite',
    category: 'Favorites',
    icon: 'Info',
  },
  {
    id: 'FIRST_WATCH_MOVIE',
    name: 'First movie',
    description: 'Watch your first movie',
    category: 'Cinema',
    icon: 'Info',
  },
  {
    id: 'SECOND_WATCH_MOVIE',
    name: 'Second movie',
    description: 'Watch your second movie',
    category: 'Cinema',
    icon: 'Info',
  },
  {
    id: 'THIRD_WATCH_MOVIE',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Cinema',
    icon: 'Profile',
  },
]

export const createInMemoryAchievementGateway = (delay = 0): AchievementGateway => {
  return {
    async getAll() {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return achievements
    },
  }
}
