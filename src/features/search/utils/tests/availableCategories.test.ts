import { omit } from 'lodash'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA_DEPRECATED } from 'features/search/enums'
import { availableCategories } from 'features/search/utils/availableCategories'

describe('availableCategories', () => {
  it('should return all searchable categories from CATEGORY_CRITERIA_DEPRECATED - without NONE', () => {
    expect(availableCategories).toEqual(
      omit(CATEGORY_CRITERIA_DEPRECATED, SearchGroupNameEnum.NONE)
    )
  })
})
