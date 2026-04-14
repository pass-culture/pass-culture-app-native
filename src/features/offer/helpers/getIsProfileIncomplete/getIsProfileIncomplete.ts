import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const getIsProfileIncomplete = (user?: UserProfileResponseWithoutSurvey): boolean => {
  if (!user) return true
  return [user.firstName, user.lastName, user.postalCode, user.city, user.activityId].some(Boolean)
}
