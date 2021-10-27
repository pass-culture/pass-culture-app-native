import { omit } from 'lodash'

import { SearchGroupNameEnum } from 'api/gen'
import { CategoryCriteria, CATEGORY_CRITERIA } from 'features/search/enums'

export const useAvailableCategories = (): Partial<CategoryCriteria> => {
  return omit(CATEGORY_CRITERIA, [SearchGroupNameEnum.NONE])
}

// The available categories are every category expect "None" or "Toutes les catégories"
export const availableCategories = omit(CATEGORY_CRITERIA, [SearchGroupNameEnum.NONE])
