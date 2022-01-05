import omit from 'lodash/omit'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'

// The available categories are every category expect "None" or "Toutes les catégories"
export const availableCategories = omit(CATEGORY_CRITERIA, SearchGroupNameEnum.NONE)
