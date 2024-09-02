import { NativeCategoryIdEnumv2 } from 'api/gen'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { renderHook } from 'tests/utils'

jest.mock('libs/react-native-batch', () => jest.requireActual('__mocks__/libs/react-native-batch'))

describe('useOfferBatchTracking', () => {
  it('should return trackEventHasSeenOfferOnce', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
    )

    expect(result.current?.trackEventHasSeenOfferOnce).toBeInstanceOf(Function)
  })

  it('should return trackBatchEvent', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
    )

    expect(result.current?.trackBatchEvent).toBeInstanceOf(Function)
  })

  it('should return true for shouldTriggerBatchSurveyEvent when native category is not eligible for survey', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS })
    )

    expect(result.current?.shouldTriggerBatchSurveyEvent).toBeTruthy()
  })

  it('should call trackEventHasSeenOfferForSurveyOnce', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
    )

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenOfferForSurvey)
  })

  it('shoyld call trackEventHasSeenOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
    )

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(1)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(1)
  })

  it('should call trackBookOfferForSurveyOnce when native category is LIVRES_PAPIER', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER })
    )

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenBookOfferForSurvey)
  })

  it('shoyld call trackBookOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.LIVRES_PAPIER })
    )

    result.current?.trackBatchEvent()

    // 2 because trackEventHasSeenOfferForSurveyOnce is executed too
    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)
  })

  it('should call trackCulturalVisitOfferForSurveyOnce when native category is VISITES_CULTURELLES', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.VISITES_CULTURELLES })
    )

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenCulturalVisitForSurvey)
  })

  it('shoyld call trackCulturalVisitOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.VISITES_CULTURELLES })
    )

    result.current?.trackBatchEvent()

    // 2 because trackEventHasSeenOfferForSurveyOnce is executed too
    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)
  })

  it('should call trackConcertOfferForSurveyOnce when native category is CONCERTS_EVENEMENTS', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS })
    )

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenConcertForSurvey)
  })

  it('shoyld call trackConcertOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS })
    )

    result.current?.trackBatchEvent()

    // 2 because trackEventHasSeenOfferForSurveyOnce is executed too
    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)
  })

  it('should call trackCinemaOfferForSurveyOnce when native category is SEANCES_DE_CINEMA', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA })
    )

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenCinemaOfferForSurvey)
  })

  it('shoyld call trackCinemaOfferForSurveyOnce only once', () => {
    const { result } = renderHook(() =>
      useOfferBatchTracking({ offerNativeCategory: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA })
    )

    result.current?.trackBatchEvent()

    // 2 because trackEventHasSeenOfferForSurveyOnce is executed too
    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)

    result.current?.trackBatchEvent()

    expect(BatchUser.trackEvent).toHaveBeenCalledTimes(2)
  })
})
