import {
  Achievement,
  AchievementCategory,
  AchievementId,
  UserAchievement,
} from 'features/profile/pages/Achievements/AchievementData'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Badges = {
  category: AchievementCategory
  remainingAchievements: number
  progress: number
  progressText: string
  achievements: {
    id: AchievementId
    name: string
    description: string
    illustration: React.FC<AccessibleIcon>
    isCompleted: boolean
  }[]
}[]

type Props = {
  achievements: Achievement[]
  completedAchievements: UserAchievement[]
}

export const useAchievements = ({ achievements, completedAchievements }: Props) => {
  const badges: Badges = achievements.reduce((acc, achievement) => {
    const category = acc.find((badge) => badge.category === achievement.category)
    const isCompleted = completedAchievements.some((u) => u.id === achievement.id)

    const badge = {
      id: achievement.id,
      name: isCompleted ? achievement.name : 'Badge non débloqué',
      description: isCompleted ? achievement.descriptionUnlocked : achievement.descriptionLocked,
      illustration: isCompleted ? achievement.illustrationUnlocked : achievement.illustrationLocked,
      isCompleted,
    }

    if (category) {
      category.achievements.push(badge)

      if (!isCompleted) {
        category.remainingAchievements++
      }

      const actualAchievements = category.achievements.length - category.remainingAchievements
      category.progress = actualAchievements / category.achievements.length
      category.progressText = `${actualAchievements}/${category.achievements.length}`
      return acc
    }

    acc.push({
      category: achievement.category,
      progress: isCompleted ? 1 : 0,
      progressText: isCompleted ? '100%' : '0%',
      remainingAchievements: isCompleted ? 0 : 1,

      achievements: [badge],
    })

    return acc
  }, [] as Badges)

  return {
    badges,
  }
}
