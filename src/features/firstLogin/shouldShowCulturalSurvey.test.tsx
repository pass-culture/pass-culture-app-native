import { renderHook } from '@testing-library/react-hooks'

import { SettingsResponse, UserProfileResponse } from 'api/gen'
import {
  shouldShowCulturalSurvey,
  useShouldShowCulturalSurvey,
} from 'features/firstLogin/shouldShowCulturalSurvey'

const mockUserPassing = {
  isBeneficiary: true,
  needsToFillCulturalSurvey: true,
} as UserProfileResponse
let mockUser: UserProfileResponse | undefined = mockUserPassing
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: mockUser })),
}))

const mockSettingsPassing = { enableCulturalSurvey: true } as SettingsResponse
let mockSettings: SettingsResponse | undefined = mockSettingsPassing
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

const resetMocks = () => {
  mockUser = {
    isBeneficiary: true,
    needsToFillCulturalSurvey: true,
  } as UserProfileResponse
  mockSettings = { enableCulturalSurvey: true } as SettingsResponse
}

describe('shouldShowCulturalSurvey', () => {
  afterEach(resetMocks)

  describe('should not show cultural survey when', () => {
    it('user is unknown', () => {
      mockUser = undefined
      expect(shouldShowCulturalSurvey(mockUser, mockSettings)).toBe(false)
    })

    it('user is known and settings are unknown', () => {
      mockSettings = undefined
      expect(shouldShowCulturalSurvey(mockUser, mockSettings)).toBe(false)
    })

    it('user is not beneficiary', () => {
      mockUser = { isBeneficiary: false } as UserProfileResponse
      expect(shouldShowCulturalSurvey(mockUser, mockSettings)).toBe(false)
    })

    it("user doesn't need to see it", () => {
      mockUser = { isBeneficiary: true, needsToFillCulturalSurvey: false } as UserProfileResponse
      expect(shouldShowCulturalSurvey(mockUser, mockSettings)).toBe(false)
    })

    it("user need to see it and feature flag doesn't allow it", () => {
      mockSettings = { enableCulturalSurvey: false } as SettingsResponse
      expect(shouldShowCulturalSurvey(mockUser, mockSettings)).toBe(false)
    })
  })

  it('should show cultural survey when user need to see it and feature flag allows it', () => {
    expect(shouldShowCulturalSurvey(mockUser, mockSettings)).toBe(true)
  })
})

describe('useShouldShowCulturalSurvey', () => {
  afterEach(resetMocks)

  it('should show cultural survey when user need to see it and feature flag allows it', () => {
    const { result } = renderHook(useShouldShowCulturalSurvey)
    expect(result.current).toBe(true)
  })
})
