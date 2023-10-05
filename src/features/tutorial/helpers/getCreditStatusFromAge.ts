import { CreditStatus } from 'features/tutorial/enums'

export const getCreditStatusFromAge = (userAge: number, age: number) => {
  if (userAge > age) {
    return CreditStatus.GONE
  } else if (userAge < age) {
    return CreditStatus.COMING
  }
  return CreditStatus.ONGOING
}
