import { UserProfileResponseWithoutSurvey } from 'features/share/types'

export const getIsProfileIncomplete = (user?: UserProfileResponseWithoutSurvey): boolean => {
  if (!user) return true

  const isEmpty = (field) => field == null || field === ''
  return [user.firstName, user.lastName, user.postalCode, user.city, user.activityId].some(isEmpty)
}
