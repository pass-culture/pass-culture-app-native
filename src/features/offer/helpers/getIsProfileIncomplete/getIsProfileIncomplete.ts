import { UserProfileResponse } from 'api/gen'

export const getIsProfileIncomplete = (user?: UserProfileResponse): boolean => {
  if (!user) return true

  const isEmpty = (field) => field == null || field === ''
  return [user.firstName, user.lastName, user.postalCode, user.city, user.activityId].some(isEmpty)
}
