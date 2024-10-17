import { useAuthContext } from 'features/auth/context/AuthContext'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { useGetMaxPrice } from 'features/search/helpers/useMaxPrice/useGetMaxPrice'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'

export const useMaxPrice = (): number => {
  const maxPrice = useGetMaxPrice()
  const { user } = useAuthContext()

  const initialCredit = user?.domainsCredit?.all.initial

  if (!user || !initialCredit) return maxPrice

  if (isUserExBeneficiary(user) || initialCredit === 0) return maxPrice

  return convertCentsToEuros(initialCredit)
}
