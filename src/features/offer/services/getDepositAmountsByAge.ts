import { getAge } from 'features/offer/services/getAge'

export const getDepositAmountsByAge = (birthDate: string): string | undefined => {
  const age = getAge(birthDate)
  if (age === 15 || age === 16) return '20\u00a0€'
  if (age === 17) return '30\u00a0€'
  if (age === 18) return '300\u00a0€'
  return undefined
}
