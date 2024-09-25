import { AchievementGateway } from 'features/profile/api/Achievements/application/AchievementGateway'
import { Achievement } from 'features/profile/api/Achievements/stores/achievements.store'
import { UserAchievement } from 'features/profile/api/Achievements/stores/user-achievements.store'

const achievements: Achievement[] = [
  {
    id: 'FIRST_ADD_FAVORITE',
    name: 'Ajout d’un favori',
    description: 'Tu as mis une offre en favoris pour la première fois\u00a0!',
    category: 'Tutoriel',
    icon: 'Heart',
  },
  {
    id: 'SECOND_ADD_FAVORITE',
    name: 'Second favorite',
    description: 'Add your second favorite',
    category: 'Tutoriel',
    icon: 'Profile',
  },
  {
    id: 'THIRD_ADD_FAVORITE',
    name: 'Third favorite',
    description: 'Add your third favorite',
    category: 'Tutoriel',
    icon: 'Info',
  },

  {
    id: 'FIRST_WATCH_MOVIE',
    name: 'First movie',
    description: 'Watch your first movie',
    category: 'Découvre le catalogue',
    icon: 'Info',
  },
  {
    id: 'SECOND_WATCH_MOVIE',
    name: 'Second movie',
    description: 'Watch your second movie',
    category: 'Découvre le catalogue',
    icon: 'Info',
  },
  {
    id: 'THIRD_WATCH_MOVIE',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Découvre le catalogue',
    icon: 'Profile',
  },

  {
    id: 'SECOND_WATCH_MOVIE',
    name: 'Second movie',
    description: 'Watch your second movie',
    category: 'Activité',
    icon: 'Info',
  },
  {
    id: 'THIRD_WATCH_MOVIE',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Activité',
    icon: 'Profile',
  },

  {
    id: 'SECOND_WATCH_MOVIE',
    name: 'Second movie',
    description: 'Watch your second movie',
    category: 'Évènements',
    icon: 'Info',
  },
  {
    id: 'THIRD_WATCH_MOVIE',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Évènements',
    icon: 'Profile',
  },
  {
    id: 'THIRD_WATCH_MOVIE',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Évènements',
    icon: 'Profile',
  },
  {
    id: 'THIRD_WATCH_MOVIE',
    name: 'Third movie',
    description: 'Watch your third movie',
    category: 'Évènements',
    icon: 'Profile',
  },
]

const userAchievements: UserAchievement[] = [{ id: 'FIRST_ADD_FAVORITE', completedAt: new Date() }]

export const createInMemoryAchievementGateway = (delay = 0): AchievementGateway => {
  return {
    async getAll() {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return achievements
    },
    async getCompletedAchievements() {
      await new Promise((resolve) => setTimeout(resolve, delay))
      return userAchievements
    },
    onAchievementCompleted() {
      // noop
    },
  }
}

export type InMemoryAchievementGateway = ReturnType<typeof createInMemoryAchievementGateway>
