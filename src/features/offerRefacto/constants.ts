import { SubcategoryIdEnumv2 } from 'api/gen'
import { BatchEvent } from 'libs/react-native-batch'
import { getSpacing } from 'ui/theme'

export const RATIO_PORTRAIT = 2 / 3
export const RATIO_SQUARE = 1

export const PORTRAIT_DIMENSIONS = {
  default: { height: getSpacing(95), width: getSpacing(95) * RATIO_PORTRAIT },
  music: { height: getSpacing(60), width: getSpacing(60) },
} as const

export const BATCH_EVENT_BY_SUBCATEGORY: Partial<Record<SubcategoryIdEnumv2, BatchEvent>> = {
  [SubcategoryIdEnumv2.SEANCE_CINE]: BatchEvent.hasSeenCinemaOfferForSurvey,
  [SubcategoryIdEnumv2.CINE_PLEIN_AIR]: BatchEvent.hasSeenCinemaOfferForSurvey,
  [SubcategoryIdEnumv2.CINE_VENTE_DISTANCE]: BatchEvent.hasSeenCinemaOfferForSurvey,
  [SubcategoryIdEnumv2.VISITE]: BatchEvent.hasSeenCulturalVisitForSurvey,
  [SubcategoryIdEnumv2.VISITE_GUIDEE]: BatchEvent.hasSeenCulturalVisitForSurvey,
  [SubcategoryIdEnumv2.MUSEE_VENTE_DISTANCE]: BatchEvent.hasSeenCulturalVisitForSurvey,
  [SubcategoryIdEnumv2.LIVRE_PAPIER]: BatchEvent.hasSeenBookOfferForSurvey,
  [SubcategoryIdEnumv2.CONCERT]: BatchEvent.hasSeenConcertForSurvey,
  [SubcategoryIdEnumv2.EVENEMENT_MUSIQUE]: BatchEvent.hasSeenConcertForSurvey,
  [SubcategoryIdEnumv2.ABO_CONCERT]: BatchEvent.hasSeenConcertForSurvey,
}
