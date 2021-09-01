import { omit } from 'lodash'

import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'

export const useAvailableSearchCategories = () => {
  const availableCategories = useAvailableCategories()
  return omit(availableCategories, 'ALL')
}
