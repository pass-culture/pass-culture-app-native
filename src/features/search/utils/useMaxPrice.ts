import { useUserProfileInfo } from 'features/home/api'
import { isUserExBeneficiary } from 'features/profile/utils'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'

export const useMaxPrice = (): number => {
  const { data: user } = useUserProfileInfo()

  const initialCredit = user?.domainsCredit?.all.initial

  if (!user || !initialCredit) return MAX_PRICE

  if (isUserExBeneficiary(user) || initialCredit === 0) return MAX_PRICE

  return convertCentsToEuros(initialCredit)
}
