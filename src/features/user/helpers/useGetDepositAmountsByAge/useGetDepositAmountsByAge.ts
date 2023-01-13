import { useDepositAmountsByAge } from 'features/auth/helpers/useDepositAmountsByAge'
import { getAge } from 'features/offer/helpers/getAge/getAge'

export const useGetDepositAmountsByAge = (birthDate?: string | null): string | undefined => {
  const {
    fifteenYearsOldDeposit,
    sixteenYearsOldDeposit,
    seventeenYearsOldDeposit,
    eighteenYearsOldDeposit,
  } = useDepositAmountsByAge()

  if (!birthDate) return undefined

  const age = getAge(birthDate)
  if (age === 15) return fifteenYearsOldDeposit
  if (age === 16) return sixteenYearsOldDeposit
  if (age === 17) return seventeenYearsOldDeposit
  if (age === 18) return eighteenYearsOldDeposit

  return undefined
}
