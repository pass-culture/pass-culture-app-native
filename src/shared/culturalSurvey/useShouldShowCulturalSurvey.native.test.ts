import { beneficiaryUser } from 'fixtures/user'
import { storage } from 'libs/storage'
import { renderHook, act } from 'tests/utils'

import { useShouldShowCulturalSurvey } from './useShouldShowCulturalSurvey'

const CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY = 'times_cultural_survey_has_been_requested'

describe('useShouldShowCulturalSurvey()', () => {
  beforeEach(() => {
    storage.clear(CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY)
  })

  it('should return undefined while reading information', async () => {
    const { result } = renderHook(useShouldShowCulturalSurvey)

    const shouldShowCulturalSurvey = result.current(beneficiaryUser)
    await act(() => {})

    expect(shouldShowCulturalSurvey).toBeUndefined()
  })

  it('should return true when user has never seen cultural survey', async () => {
    const { result } = renderHook(useShouldShowCulturalSurvey)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current(beneficiaryUser)

    expect(shouldShowCulturalSurvey).toBe(true)
  })

  it('should return false when user has already filled cultural survey', async () => {
    const { result } = renderHook(useShouldShowCulturalSurvey)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current({
      ...beneficiaryUser,
      needsToFillCulturalSurvey: false,
    })

    expect(shouldShowCulturalSurvey).toBe(false)
  })

  it('should return true when user has seen cultural survey twice', async () => {
    storage.saveObject(CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY, 2)
    const { result } = renderHook(useShouldShowCulturalSurvey)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current(beneficiaryUser)

    expect(shouldShowCulturalSurvey).toBe(true)
  })

  it('should return false when user has seen cultural survey more than twice', async () => {
    storage.saveObject(CULTURAL_SURVEY_DISPLAYS_STORAGE_KEY, 3)
    const { result } = renderHook(useShouldShowCulturalSurvey)

    await act(() => {})
    const shouldShowCulturalSurvey = result.current(beneficiaryUser)

    expect(shouldShowCulturalSurvey).toBe(false)
  })
})
