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

export type UseAchivementsProps = {
  achievements: Achievement[]
  completedAchievements: UserAchievement[]
}

export const useAchievements = ({
  achievements,
  completedAchievements,
}: UseAchivementsProps): Badges =>
  getAchievementsCategories(achievements).map(createCategory(achievements, completedAchievements))

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
  (achievements: Achievement[], completedAchievements: UserAchievement[]) =>
  (category: AchievementCategory) => {
    const categoryAchievements = getAchievementsByCategory(achievements, category)

    const completedCategoryAchievements = getCompletedAchievements(
      categoryAchievements,
      completedAchievements
    )

    const remainingAchievements = categoryAchievements.length - completedCategoryAchievements.length

    const badges = categoryAchievements.map(createAchievement(completedAchievements))

    const completedBadges = badges
      .filter((a) => a.isCompleted)
      .sort((a, b) => a.name.localeCompare(b.name))

    const uncompletedBadges = badges.filter((a) => !a.isCompleted)

    return {
      category,
      progress: completedCategoryAchievements.length / categoryAchievements.length,
      progressText: `${completedCategoryAchievements.length}/${categoryAchievements.length}`,
      remainingAchievementsText: `${remainingAchievements} badge${remainingAchievements > 1 ? 's' : ''} restant`,
      achievements: [...completedBadges, ...uncompletedBadges],
    }
  }

const LOCKED_BADGE_NAME = 'Badge non débloqué'

const createAchievement =
  (completedAchievements: UserAchievement[]) => (achievement: Achievement) => {
    const isCompleted = isAchievementCompleted(achievement, completedAchievements)

    return {
      id: achievement.id,
      name: isCompleted ? achievement.name : LOCKED_BADGE_NAME,
      description: isCompleted ? achievement.descriptionUnlocked : achievement.descriptionLocked,
      illustration: isCompleted ? achievement.illustrationUnlocked : achievement.illustrationLocked,
      isCompleted,
    }
  }
