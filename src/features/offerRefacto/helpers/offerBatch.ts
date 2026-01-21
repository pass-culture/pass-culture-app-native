import { SubcategoryIdEnumv2 } from 'api/gen'
import { BATCH_EVENT_BY_SUBCATEGORY } from 'features/offerRefacto/constants'
import { BatchEvent } from 'libs/react-native-batch'

export const getBatchEventForSubcategory = (
  subcategoryId: SubcategoryIdEnumv2
): BatchEvent | undefined => {
  return BATCH_EVENT_BY_SUBCATEGORY[subcategoryId]
}

export const isSubcategoryEligibleForBatchSurvey = (
  subcategoryId: SubcategoryIdEnumv2
): boolean => {
  return subcategoryId in BATCH_EVENT_BY_SUBCATEGORY
}
