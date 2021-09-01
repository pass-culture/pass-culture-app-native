import { renderHook } from '@testing-library/react-hooks'
import { omit } from 'lodash'

import { CategoryNameEnum, UserRole } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useAvailableSearchCategories } from 'features/search/utils/useAvailableSearchCategories'

const mockUserProfileInfo = {
  firstName: 'Christophe',
  lastName: 'Dupont',
  roles: [UserRole.BENEFICIARY],
}
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: mockUserProfileInfo })),
}))

describe('useAvailableCategories', () => {
  beforeEach(jest.clearAllMocks)
  it('should return CATEGORY_CRITERIA is user is beneficiary', () => {
    const { result } = renderHook(useAvailableSearchCategories)
    const searchCategories = omit(CATEGORY_CRITERIA, 'ALL')
    expect(result.current).toEqual(searchCategories)
  })

  it('should return CATEGORY_CRITERIA except JEUX_VIDEO if user is underage beneficiary', () => {
    mockUserProfileInfo.roles = [UserRole.UNDERAGEBENEFICIARY]
    const { result } = renderHook(useAvailableSearchCategories)
    const searchCategories = omit(CATEGORY_CRITERIA, 'ALL')
    const underageSearchCategories = omit(searchCategories, CategoryNameEnum.JEUXVIDEO)
    expect(result.current).toEqual(underageSearchCategories)
  })
})
