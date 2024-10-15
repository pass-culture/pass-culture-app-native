import { UserProfileResponse } from 'api/gen'

export function calculateAge(user: UserProfileResponse) {
  if (!user.birthDate) return -1

  const now = new Date()
  const birthDate = new Date(user.birthDate)
  const year = now.getFullYear() - birthDate.getFullYear()
  const month = now.getMonth() - birthDate.getMonth()
  const day = now.getDate() - birthDate.getDate()
  const isBeforeBirthday = month < 0 || (month === 0 && day < 0)

  return isBeforeBirthday ? year - 1 : year
}
