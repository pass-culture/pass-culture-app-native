import { Achievement } from 'features/profile/api/Achievements/achievements.store'

export type AchievementGateway = {
  getAll(): Promise<Achievement[]>
}
