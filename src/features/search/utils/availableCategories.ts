import { omit } from 'lodash'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA_DEPRECATED } from 'features/search/enums'

// The available categories are every category expect "None" or "Toutes les catégories"
export const availableCategories = omit(CATEGORY_CRITERIA_DEPRECATED, SearchGroupNameEnum.NONE)
