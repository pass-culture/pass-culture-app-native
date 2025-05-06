import { AchievementEnum, AchievementResponse } from 'api/gen'
import { Achievement, AchievementCategory } from 'features/achievements/data/AchievementData'
import { analytics } from 'libs/analytics/provider'
import { AccessibleIcon } from 'ui/svg/icons/types'

type Categories = {
  name: AchievementCategory
  remainingAchievementsText: string
  progress: number
  progressText: string
  achievements: {
    name: AchievementEnum
    title: string
    illustration: React.FC<AccessibleIcon>
    isCompleted: boolean
  }[]
}[]

type GetAchievements = {
  categories: Categories
  track: (from: 'profile' | 'success' | 'cheatcodes') => void
}

export type GetAchivementsParams = {
  achievements: Achievement[]
  completedAchievements: AchievementResponse[]
}

export const getAchievements = ({
  achievements,
  completedAchievements,
}: GetAchivementsParams): GetAchievements => {
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
  completedAchievements: AchievementResponse[]
) => completedAchievements.some((u) => u.name === achievement.name)

const getCompletedAchievements = (
  achievements: Achievement[],
  completedAchievements: AchievementResponse[]
) =>
  achievements.filter((achievement) => isAchievementCompleted(achievement, completedAchievements))

const getAchievementsByCategory = (achievements: Achievement[], category: AchievementCategory) =>
  achievements.filter((achievement) => achievement.category === category)

const createCategory =
  (achievements: Achievement[], completedUserAchievements: AchievementResponse[]) =>
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
      name: category,
      progress: completedCategoryAchievements.length / categoryAchievements.length,
      progressText: `${completedCategoryAchievements.length}/${categoryAchievements.length}`,
      remainingAchievementsText: `${remainingAchievements} succès restant${remainingAchievements > 1 ? 's' : ''}`,
      achievements: [...sortedCompletedUserAchievements, ...uncompletedUserAchievements],
    }
  }

const LOCKED_ACHIEVEMENT_TITLE = 'Succès non débloqué'

const createAchievement =
  (completedAchievements: AchievementResponse[]) => (achievement: Achievement) => {
    const isCompleted = isAchievementCompleted(achievement, completedAchievements)

    return {
      name: achievement.name,
      title: isCompleted ? achievement.title : LOCKED_ACHIEVEMENT_TITLE,
      illustration: isCompleted ? achievement.illustrationUnlocked : achievement.illustrationLocked,
      isCompleted,
    }
  }
