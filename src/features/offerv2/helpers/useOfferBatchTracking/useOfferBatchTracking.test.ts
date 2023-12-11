import { NativeCategoryIdEnumv2 } from 'api/gen'
import { useOfferBatchTraking } from 'features/offerv2/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { renderHook } from 'tests/utils'

describe('useOfferBatchTracking', () => {
  it('should return null when nativeCategory is undefined', () => {
    const { result } = renderHook(() => useOfferBatchTraking({ nativeCategory: undefined }))

    expect(result.current).toBeNull()
  })

  describe('When nativeCategory is defined', () => {
    it('should return trackEventHasSeenOfferOnce', () => {
      const { result } = renderHook(() =>
        useOfferBatchTraking({ nativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
      )

      expect(result.current?.trackEventHasSeenOfferOnce).toBeInstanceOf(Function)
    })

    it('should return trackEventHasSeenOfferForSurveyOnce', () => {
      const { result } = renderHook(() =>
        useOfferBatchTraking({ nativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
      )

      expect(result.current?.trackEventHasSeenOfferForSurveyOnce).toBeInstanceOf(Function)
    })

    it('should return trackBookOfferForSurveyOnce', () => {
      const { result } = renderHook(() =>
        useOfferBatchTraking({ nativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
      )

      expect(result.current?.trackBookOfferForSurveyOnce).toBeInstanceOf(Function)
    })

    it('should return trackCinemaOfferForSurveyOnce', () => {
      const { result } = renderHook(() =>
        useOfferBatchTraking({ nativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
      )

      expect(result.current?.trackCinemaOfferForSurveyOnce).toBeInstanceOf(Function)
    })

    it('should return trackCulturalVisitOfferForSurveyOnce', () => {
      const { result } = renderHook(() =>
        useOfferBatchTraking({ nativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
      )

      expect(result.current?.trackCulturalVisitOfferForSurveyOnce).toBeInstanceOf(Function)
    })

    it('should return trackConcertOfferForSurveyOnce', () => {
      const { result } = renderHook(() =>
        useOfferBatchTraking({ nativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
      )

      expect(result.current?.trackConcertOfferForSurveyOnce).toBeInstanceOf(Function)
    })

    it('should return true for shouldTriggerBatchSurveyEvent when native category is eligible for survey', () => {
      const { result } = renderHook(() =>
        useOfferBatchTraking({ nativeCategory: NativeCategoryIdEnumv2.ABONNEMENTS_MUSEE })
      )

      expect(result.current?.shouldTriggerBatchSurveyEvent).toBeFalsy()
    })

    it('should return true for shouldTriggerBatchSurveyEvent when native category is not eligible for survey', () => {
      const { result } = renderHook(() =>
        useOfferBatchTraking({ nativeCategory: NativeCategoryIdEnumv2.CONCERTS_EVENEMENTS })
      )

      expect(result.current?.shouldTriggerBatchSurveyEvent).toBeTruthy()
    })
  })
})
