import { omit } from 'lodash'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { availableCategories } from 'features/search/helpers/availableCategories/availableCategories'

describe('availableCategories', () => {
  it('should return all searchable categories from CATEGORY_CRITERIA - without NONE, INSTRUMENTS, CD_VINYLE_MUSIQUE_EN_LIGNE', () => {
    expect(availableCategories).toEqual(
      omit(
        CATEGORY_CRITERIA,
        SearchGroupNameEnumv2.NONE,
        SearchGroupNameEnumv2.INSTRUMENTS,
        SearchGroupNameEnumv2.CD_VINYLE_MUSIQUE_EN_LIGNE
      )
    )
  })
})
