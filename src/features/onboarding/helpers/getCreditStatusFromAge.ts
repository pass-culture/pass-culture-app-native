import { CreditStatus } from 'features/onboarding/types'

export const getCreditStatusFromAge = (userAge: number | undefined, age: number) => {
  if (!userAge) {
    return undefined
  }
  if (userAge > age) {
    return CreditStatus.GONE
  }
  if (userAge < age) {
    return CreditStatus.COMING
  }
  return CreditStatus.ONGOING
}
