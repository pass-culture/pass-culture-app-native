import { omit } from 'lodash'

import { CategoryNameEnum } from 'api/gen'
import { useUserProfileInfo } from 'features/home/api'
import { isUserUnderageBeneficiary } from 'features/profile/utils'
import { CATEGORY_CRITERIA } from 'features/search/enums'

export const useAvailableCategories = () => {
  const { data: user } = useUserProfileInfo()
  const isUserUnderage = user && isUserUnderageBeneficiary(user)

  if (isUserUnderage) {
    return omit(CATEGORY_CRITERIA, CategoryNameEnum.JEUXVIDEO)
  }
  return CATEGORY_CRITERIA
}
