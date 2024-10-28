import { SubcategoryIdEnumv2 } from 'api/gen'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { renderHook } from 'tests/utils'

jest.mock('libs/react-native-batch', () => jest.requireActual('__mocks__/libs/react-native-batch'))

describe('useOfferBatchTracking', () => {
  it('should return trackEventHasSeenOfferOnce', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.CARTE_MUSEE))

    expect(result.current?.trackEventHasSeenOfferOnce).toBeInstanceOf(Function)
  })

  it('should return trackBatchEvent', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.CARTE_MUSEE))

    expect(result.current?.trackBatchEvent).toBeInstanceOf(Function)
  })

  it('should return true for shouldTriggerBatchSurveyEvent when subcategory is not eligible for survey', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.CONCERT))

    expect(result.current?.shouldTriggerBatchSurveyEvent).toBeTruthy()
  })

  it('should call trackEventHasSeenOfferForSurveyOnce', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.CARTE_MUSEE))

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
  })

  it('shoyld call trackEventHasSeenOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.CARTE_MUSEE))

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(1)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(1)
  })

  it('should call trackBookOfferForSurveyOnce when subcategory is LIVRE_PAPIER', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.LIVRE_PAPIER))

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenBookOfferForSurvey)
  })

  it('should call trackBookOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.LIVRE_PAPIER))

    result.current?.trackBatchEvent()

    // 2 because trackEventHasSeenOfferForSurveyOnce is executed too
    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)
  })

  it('should call trackCulturalVisitOfferForSurveyOnce when subcategory is VISITES_CULTURELLES', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.VISITE))

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenCulturalVisitForSurvey)
  })

  it('shoyld call trackCulturalVisitOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.VISITE))

    result.current?.trackBatchEvent()

    // 2 because trackEventHasSeenOfferForSurveyOnce is executed too
    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)
  })

  it('should call trackConcertOfferForSurveyOnce when subcategory is CONCERT', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.CONCERT))

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenConcertForSurvey)
  })

  it('shoyld call trackConcertOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.CONCERT))

    result.current?.trackBatchEvent()

    // 2 because trackEventHasSeenOfferForSurveyOnce is executed too
    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)
  })

  it('should call trackCinemaOfferForSurveyOnce when subcategory is SEANCES_DE_CINEMA', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.SEANCE_CINE))

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenCinemaOfferForSurvey)
  })

  it('shoyld call trackCinemaOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() => useOfferBatchTracking(SubcategoryIdEnumv2.SEANCE_CINE))

    result.current?.trackBatchEvent()

    // 2 because trackEventHasSeenOfferForSurveyOnce is executed too
    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)
  })
})
