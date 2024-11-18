import { useAuthContext } from 'features/auth/context/AuthContext'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { MAX_PRICE_IN_CENTS } from 'features/search/helpers/reducer.helpers'

export const useMaxPrice = (): number => {
  const { user } = useAuthContext()

  const initialCredit = user?.domainsCredit?.all.initial

  if (!user || !initialCredit) return MAX_PRICE_IN_CENTS

  if (isUserExBeneficiary(user) || initialCredit === 0) return MAX_PRICE_IN_CENTS

  return initialCredit
}
