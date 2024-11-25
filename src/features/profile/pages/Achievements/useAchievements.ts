import {
  Achievement,
  AchievementCategory,
  AchievementId,
  UserAchievement,
} from 'features/profile/pages/Achievements/AchievementData'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Badges = {
  category: AchievementCategory
  remainingAchievementsText: string
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

type UseAchievements = {
  badges: Badges
}

export const useAchievements = ({
  achievements,
  completedAchievements,
}: Props): UseAchievements => {
  return {
    badges: getAchievementsCategories(achievements).map(
      createCategory(achievements, completedAchievements)
    ),
  }
}

const isAchievementCompleted = (
  achievement: Achievement,
  completedAchievements: UserAchievement[]
) => completedAchievements.some((u) => u.id === achievement.id)

const getCompletedAchievements = (
  achievements: Achievement[],
  completedAchievements: UserAchievement[]
) =>
  achievements.filter((achievement) => isAchievementCompleted(achievement, completedAchievements))

const getAchievementsByCategory = (achievements: Achievement[], category: AchievementCategory) =>
  achievements.filter((achievement) => achievement.category === category)

const createCategory =
  (achievements: Achievement[], completedAchievements: UserAchievement[]) =>
  (category: AchievementCategory) => {
    const categoryAchievements = getAchievementsByCategory(achievements, category)

    const completedCategoryAchievements = getCompletedAchievements(
      categoryAchievements,
      completedAchievements
    )

    const remainingAchievements = categoryAchievements.length - completedCategoryAchievements.length

    return {
      category,
      progress: completedCategoryAchievements.length / categoryAchievements.length,
      progressText: `${completedCategoryAchievements.length}/${categoryAchievements.length}`,
      remainingAchievementsText: `${remainingAchievements} badge${remainingAchievements > 1 ? 's' : ''} restant`,
      achievements: categoryAchievements.map(createAchievement(completedAchievements)),
    }
  }

const createAchievement =
  (completedAchievements: UserAchievement[]) => (achievement: Achievement) => {
    const isCompleted = isAchievementCompleted(achievement, completedAchievements)

    return {
      id: achievement.id,
      name: isCompleted ? achievement.name : 'Badge non débloqué',
      description: isCompleted ? achievement.descriptionUnlocked : achievement.descriptionLocked,
      illustration: isCompleted ? achievement.illustrationUnlocked : achievement.illustrationLocked,
      isCompleted,
    }
  }

const getAchievementsCategories = (achievements: Achievement[]) =>
  Array.from(new Set(achievements.map((achievement) => achievement.category)))
