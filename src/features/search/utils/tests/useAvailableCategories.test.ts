import { omit } from 'lodash'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { availableCategories } from 'features/search/utils/useAvailableCategories'

describe('availableCategories', () => {
  it('should return all searchable categories from CATEGORY_CRITERIA - without NONE', () => {
    expect(availableCategories).toEqual(omit(CATEGORY_CRITERIA, SearchGroupNameEnum.NONE))
  })
})
