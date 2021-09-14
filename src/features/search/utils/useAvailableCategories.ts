import { omit } from 'lodash'

import { CategoryIdEnum } from 'api/gen'
import { useIsUserUnderage } from 'features/profile/utils'
import { CATEGORY_CRITERIA } from 'features/search/enums'

export const useAvailableCategories = () => {
  const isUserUnderage = useIsUserUnderage()
  return isUserUnderage ? omit(CATEGORY_CRITERIA, CategoryIdEnum.JEUXVIDEO) : CATEGORY_CRITERIA
}
