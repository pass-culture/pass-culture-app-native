import { omit } from 'lodash'

import { SearchGroupNameEnum } from 'api/gen'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'

export const useAvailableSearchCategories = () => {
  const availableCategories = useAvailableCategories()
  return omit(availableCategories, SearchGroupNameEnum.NONE)
}
