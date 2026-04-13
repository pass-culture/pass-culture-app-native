import { UserProfile } from 'features/share/types'

export const getIsProfileIncomplete = (user?: UserProfile): boolean => {
  if (!user) return true

  const isEmpty = (field) => field == null || field === ''
  return [user.firstName, user.lastName, user.postalCode, user.city, user.activityId].some(isEmpty)
}
