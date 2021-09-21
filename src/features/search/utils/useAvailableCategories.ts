import { omit } from 'lodash'

import { CategoryNameEnum } from 'api/gen'
import { useIsUserUnderage } from 'features/profile/utils'
import { CATEGORY_CRITERIA } from 'features/search/enums'

export const useAvailableCategories = () => {
  const isUserUnderage = useIsUserUnderage()
  return isUserUnderage ? omit(CATEGORY_CRITERIA, CategoryNameEnum.JEUXVIDEO) : CATEGORY_CRITERIA
}
