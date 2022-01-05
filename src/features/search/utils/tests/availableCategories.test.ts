import omit from 'lodash/omit'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { availableCategories } from 'features/search/utils/availableCategories'

describe('availableCategories', () => {
  it('should return all searchable categories from CATEGORY_CRITERIA - without NONE', () => {
    expect(availableCategories).toEqual(omit(CATEGORY_CRITERIA, SearchGroupNameEnum.NONE))
  })
})
