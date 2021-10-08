import { renderHook } from '@testing-library/react-hooks'
import { omit } from 'lodash'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useAvailableSearchCategories } from 'features/search/utils/useAvailableSearchCategories'

describe('useAvailableCategories', () => {
  beforeEach(jest.clearAllMocks)
  it('should return CATEGORY_CRITERIA is user is beneficiary', () => {
    const { result } = renderHook(useAvailableSearchCategories)
    const searchCategories = omit(CATEGORY_CRITERIA, SearchGroupNameEnum.NONE)
    expect(result.current).toEqual(searchCategories)
  })
})
