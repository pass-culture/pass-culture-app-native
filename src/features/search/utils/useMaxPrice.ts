import { useUserProfileInfo } from 'features/home/api'
import { MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { convertCentsToEuros } from 'libs/parsers/pricesConversion'

export const useMaxPrice = (): number => {
  const { data: user } = useUserProfileInfo()

  const initialCredit = user?.domainsCredit?.all.initial
  return initialCredit ? convertCentsToEuros(initialCredit) : MAX_PRICE
}
