import { omit } from 'lodash'

import { SearchGroupNameEnum } from 'api/gen'
import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { CategoryCriteria, CATEGORY_CRITERIA } from 'features/search/enums'

export const useAvailableCategories = (): Partial<CategoryCriteria> => {
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  return isUserUnderageBeneficiary
    ? omit(CATEGORY_CRITERIA, SearchGroupNameEnum.JEU)
    : CATEGORY_CRITERIA
}
