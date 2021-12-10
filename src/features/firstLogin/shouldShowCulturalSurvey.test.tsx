import { UserProfileResponse } from 'api/gen'
import { shouldShowCulturalSurvey } from 'features/firstLogin/shouldShowCulturalSurvey'

const mockUserPassing = {
  isBeneficiary: true,
  needsToFillCulturalSurvey: true,
} as UserProfileResponse
let mockUser: UserProfileResponse | undefined = mockUserPassing

const resetMocks = () => {
  mockUser = mockUserPassing
}

describe('shouldShowCulturalSurvey', () => {
  afterEach(resetMocks)

  describe('should not show cultural survey when', () => {
    it('user is unknown', () => {
      mockUser = undefined
      expect(shouldShowCulturalSurvey(mockUser)).toBe(false)
    })

    it('user is not beneficiary', () => {
      mockUser = { isBeneficiary: false } as UserProfileResponse
      expect(shouldShowCulturalSurvey(mockUser)).toBe(false)
    })

    it("user doesn't need to see it", () => {
      mockUser = { isBeneficiary: true, needsToFillCulturalSurvey: false } as UserProfileResponse
      expect(shouldShowCulturalSurvey(mockUser)).toBe(false)
    })
  })

  it('should show cultural survey when user need to see it and feature flag allows it', () => {
    expect(shouldShowCulturalSurvey(mockUser)).toBe(true)
  })
})
