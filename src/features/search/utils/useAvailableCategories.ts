import { omit } from 'lodash'

import { CategoryNameEnum } from 'api/gen'
import { useIsUserUnderageBeneficiary } from 'features/profile/utils'
import { CATEGORY_CRITERIA } from 'features/search/enums'

export const useAvailableCategories = () => {
  const isUserUnderageBeneficiary = useIsUserUnderageBeneficiary()
  return isUserUnderageBeneficiary
    ? omit(CATEGORY_CRITERIA, CategoryNameEnum.JEUXVIDEO)
    : CATEGORY_CRITERIA
}
