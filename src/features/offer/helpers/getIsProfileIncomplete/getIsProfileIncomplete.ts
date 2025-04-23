import { UserProfileResponse } from 'api/gen'

export const getIsProfileIncomplete = (user?: UserProfileResponse): boolean => {
  if (!user) return true
  const { firstName, lastName, postalCode, city, activityId } = user
  return [firstName, lastName, postalCode, city, activityId].some((field) => field == null)
}
