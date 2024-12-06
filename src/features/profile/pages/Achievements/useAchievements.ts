import {
  Achievement,
  AchievementCategory,
  AchievementId,
  UserAchievement,
} from 'features/profile/pages/Achievements/AchievementData'
import { analytics } from 'libs/analytics'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Categories = {
  id: AchievementCategory
  remainingAchievementsText: string
  progress: number
  progressText: string
  achievements: {
    id: AchievementId
    name: string
    illustration: React.FC<AccessibleIcon>
    isCompleted: boolean
  }[]
}[]

type UseAchievements = {
  categories: Categories
  track: (from: 'profile' | 'success' | 'cheatcodes') => void
}

export type UseAchivementsProps = {
  achievements: Achievement[]
  completedAchievements: UserAchievement[]
}

export const useAchievements = ({
  achievements,
  completedAchievements,
}: UseAchivementsProps): UseAchievements => {
  const categories = getAchievementsCategories(achievements).map(
    createCategory(achievements, completedAchievements)
  )

  const track = (from: 'profile' | 'success' | 'cheatcodes') => {
    analytics.logDisplayAchievements({ from, numberUnlocked: completedAchievements.length })
  }

  return {
    categories,
    track,
  }
}

const getAchievementsCategories = (achievements: Achievement[]) =>
  Array.from(new Set(achievements.map((achievement) => achievement.category)))

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
  (achievements: Achievement[], completedUserAchievements: UserAchievement[]) =>
  (category: AchievementCategory) => {
    const categoryAchievements = getAchievementsByCategory(achievements, category)

    const completedCategoryAchievements = getCompletedAchievements(
      categoryAchievements,
      completedUserAchievements
    )

    const remainingAchievements = categoryAchievements.length - completedCategoryAchievements.length

    const userAchievements = categoryAchievements.map(createAchievement(completedUserAchievements))

    const sortedCompletedUserAchievements = userAchievements
      .filter((a) => a.isCompleted)
      .sort((a, b) => a.name.localeCompare(b.name))

    const uncompletedUserAchievements = userAchievements.filter((a) => !a.isCompleted)

    return {
      id: category,
      progress: completedCategoryAchievements.length / categoryAchievements.length,
      progressText: `${completedCategoryAchievements.length}/${categoryAchievements.length}`,
      remainingAchievementsText: `${remainingAchievements} succès restant${remainingAchievements > 1 ? 's' : ''}`,
      achievements: [...sortedCompletedUserAchievements, ...uncompletedUserAchievements],
    }
  }

const LOCKED_ACHIEVEMENT_NAME = 'Succès non débloqué'

const createAchievement =
  (completedAchievements: UserAchievement[]) => (achievement: Achievement) => {
    const isCompleted = isAchievementCompleted(achievement, completedAchievements)

    return {
      id: achievement.id,
      name: isCompleted ? achievement.name : LOCKED_ACHIEVEMENT_NAME,
      illustration: isCompleted ? achievement.illustrationUnlocked : achievement.illustrationLocked,
      isCompleted,
    }
  }
