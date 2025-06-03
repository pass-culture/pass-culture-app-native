import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { storage } from 'libs/storage'
import { renderHook, act } from 'tests/utils'

import { useShouldShowCulturalSurveyForBeneficiaryUser } from './useShouldShowCulturalSurveyForBeneficiaryUser'

const CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY = 'times_cultural_survey_has_been_requested'

describe('useShouldShowCulturalSurveyForBeneficiaryUser()', () => {
  beforeEach(() => {
    storage.clear(CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY)
    setFeatureFlags()
  })

  it('should return true when feature flag is disabled and user has never seen cultural survey', async () => {
    const { result } = renderHook(useShouldShowCulturalSurveyForBeneficiaryUser)
    await act(() => {})
    const shouldShowCulturalSurvey = result.current(beneficiaryUser)

    expect(shouldShowCulturalSurvey).toBeTruthy()
  })

  it('should return false when cultural survey feature flag is enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_CULTURAL_SURVEY_MANDATORY])
    const { result } = renderHook(useShouldShowCulturalSurveyForBeneficiaryUser)
    await act(() => {})
    const shouldShowCulturalSurvey = result.current(beneficiaryUser)

    expect(shouldShowCulturalSurvey).toBeFalsy()
  })

  it('should return false while reading information', async () => {
    const { result } = renderHook(useShouldShowCulturalSurveyForBeneficiaryUser)

    const shouldShowCulturalSurvey = result.current(beneficiaryUser)
    await act(() => {})

    expect(shouldShowCulturalSurvey).toBeFalsy()
  })

  it('should return false when user has already filled cultural survey', async () => {
    const { result } = renderHook(useShouldShowCulturalSurveyForBeneficiaryUser)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current({
      ...beneficiaryUser,
      needsToFillCulturalSurvey: false,
    })

    expect(shouldShowCulturalSurvey).toBeFalsy()
  })

  it('should return false when user has never seen cultural survey but is not beneficiary', async () => {
    const { result } = renderHook(useShouldShowCulturalSurveyForBeneficiaryUser)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current(nonBeneficiaryUser)

    expect(shouldShowCulturalSurvey).toBeFalsy()
  })

  it('should return true when user has never seen cultural survey', async () => {
    const { result } = renderHook(useShouldShowCulturalSurveyForBeneficiaryUser)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current(beneficiaryUser)

    expect(shouldShowCulturalSurvey).toBeTruthy()
  })

  it('should return true when user has seen cultural survey twice', async () => {
    storage.saveObject(CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY, 2)
    const { result } = renderHook(useShouldShowCulturalSurveyForBeneficiaryUser)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current(beneficiaryUser)

    expect(shouldShowCulturalSurvey).toBeTruthy()
  })

  it('should return false when user has seen cultural survey more than twice', async () => {
    storage.saveObject(CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY, 3)
    const { result } = renderHook(useShouldShowCulturalSurveyForBeneficiaryUser)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current(beneficiaryUser)

    expect(shouldShowCulturalSurvey).toBeFalsy()
  })
})
