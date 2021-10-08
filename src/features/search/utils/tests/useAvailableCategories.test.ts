import { renderHook } from '@testing-library/react-hooks'
import { omit } from 'lodash'

import { SearchGroupNameEnum } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'

describe('useAvailableCategories', () => {
  beforeEach(jest.clearAllMocks)
  it('should return CATEGORY_CRITERIA is user is beneficiary', () => {
    const { result } = renderHook(useAvailableCategories)
    expect(result.current).toEqual(omit(CATEGORY_CRITERIA, SearchGroupNameEnum.NONE))
  })
})
