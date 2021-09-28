import { omit } from 'lodash'

import { CategoryIdEnum } from 'api/gen'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'

export const useAvailableSearchCategories = () => {
  const availableCategories = useAvailableCategories()
  return omit(availableCategories, ['ALL', CategoryIdEnum.TECHNIQUE])
}
