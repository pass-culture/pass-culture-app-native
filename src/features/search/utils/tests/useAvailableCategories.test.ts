import { renderHook } from '@testing-library/react-hooks'
import { omit } from 'lodash'

import { CategoryIdEnum, UserRole } from 'api/gen'
import { CATEGORY_CRITERIA } from 'features/search/enums'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'

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
    const { result } = renderHook(useAvailableCategories)
    expect(result.current).toEqual(CATEGORY_CRITERIA)
  })

  it('should return CATEGORY_CRITERIA except JEUX_VIDEO if user is underage beneficiary', () => {
    mockUserProfileInfo.roles = [UserRole.UNDERAGEBENEFICIARY]
    const { result } = renderHook(useAvailableCategories)
    const availableCategories = omit(CATEGORY_CRITERIA, CategoryIdEnum.JEUXVIDEO)
    expect(result.current).toEqual(availableCategories)
  })
})
