import { achievementsStore } from 'features/profile/api/Achievements/stores/achievements.store'
import { userAchievementsStore } from 'features/profile/api/Achievements/stores/user-achievements.store'

type Badges = {
  category: string
  remainingAchievements: number
  progress: number
  progressText: string
  achievements: {
    id: string
    name: string
    description: string
    icon: string
    isCompleted: boolean
  }[]
}[]

export const useAchievements = () => {
  const { achievements } = achievementsStore()
  const { completedAchievements } = userAchievementsStore()

  const badges: Badges = achievements.reduce((acc, achievement) => {
    const category = acc.find((badge) => badge.category === achievement.category)
    const isCompleted = completedAchievements.some((u) => u.id === achievement.id)

    if (category) {
      category.achievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        isCompleted,
      })
      if (!isCompleted) {
        category.remainingAchievements++
      }

      const actualAchievements = category.achievements.length - category.remainingAchievements

      category.progress = actualAchievements / category.achievements.length
      category.progressText = `${(category.progress * 100).toFixed(0)}%`
      return acc
    }

    acc.push({
      category: achievement.category,
      progress: isCompleted ? 1 : 0,
      progressText: isCompleted ? '100%' : '0%',
      remainingAchievements: isCompleted ? 0 : 1,

      achievements: [
        {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          isCompleted,
        },
      ],
    })
    return acc
  }, [] as Badges)

  return {
    badges,
  }
}
