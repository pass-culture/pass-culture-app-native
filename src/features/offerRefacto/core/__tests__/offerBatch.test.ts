import { SubcategoryIdEnumv2 } from 'api/gen'
import {
  getBatchEventForSubcategory,
  isSubcategoryEligibleForBatchSurvey,
} from 'features/offerRefacto/core'
import { BatchEvent } from 'libs/react-native-batch'

describe('getBatchEventForSubcategory', () => {
  it('should return the correct BatchEvent for a given subcategory', () => {
    const batchEvent = getBatchEventForSubcategory(SubcategoryIdEnumv2.SEANCE_CINE)

    expect(batchEvent).toEqual(BatchEvent.hasSeenCinemaOfferForSurvey)
  })

  it('should return undefined for a subcategory without a batch event', () => {
    const batchEvent = getBatchEventForSubcategory(
      SubcategoryIdEnumv2.LIVESTREAM_PRATIQUE_ARTISTIQUE
    )

    expect(batchEvent).toEqual(undefined)
  })
})

describe('isSubcategoryEligibleForBatchSurvey', () => {
  it('should return true for a subcategory eligible for batch survey', () => {
    const isEligible = isSubcategoryEligibleForBatchSurvey(SubcategoryIdEnumv2.CONCERT)

    expect(isEligible).toEqual(true)
  })

  it('should return false for a subcategory not eligible for batch survey', () => {
    const isEligible = isSubcategoryEligibleForBatchSurvey(
      SubcategoryIdEnumv2.LIVESTREAM_PRATIQUE_ARTISTIQUE
    )

    expect(isEligible).toEqual(false)
  })
})
