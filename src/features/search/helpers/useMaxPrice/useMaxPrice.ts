import { useAuthContext } from 'features/auth/AuthContext'
import { isUserExBeneficiary } from 'features/profile/utils'
import { MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'

export const useMaxPrice = (): number => {
  const { user } = useAuthContext()

  const initialCredit = user?.domainsCredit?.all.initial

  if (!user || !initialCredit) return MAX_PRICE

  if (isUserExBeneficiary(user) || initialCredit === 0) return MAX_PRICE

  return convertCentsToEuros(initialCredit)
}
