import { achievementsStore } from 'features/profile/api/Achievements/achievements.store'
import { userAchievementsStore } from 'features/profile/api/Achievements/user-achievements.store'

type Badges = {
  category: string
  remainingAchievements: number
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
    const exist = acc.find((badge) => badge.category === achievement.category)
    const isCompleted = completedAchievements.some((u) => u.id === achievement.id)

    if (exist) {
      exist.achievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        isCompleted,
      })
      if (!isCompleted) {
        exist.remainingAchievements++
      }
      return acc
    }

    acc.push({
      category: achievement.category,
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
