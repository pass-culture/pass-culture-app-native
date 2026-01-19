import { SubcategoryIdEnum } from 'api/gen'
import { EndedBookingReasonKey } from 'features/bookings/helpers/getEndedBookingReason'
import { EndedBookingReason } from 'features/bookings/types'
import { Valid } from 'ui/svg/icons/Valid'
import { Wrong } from 'ui/svg/icons/Wrong'

export const FREE_OFFER_CATEGORIES_TO_ARCHIVE: SubcategoryIdEnum[] = [
  SubcategoryIdEnum.CARTE_MUSEE,
  SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
  SubcategoryIdEnum.ABO_MEDIATHEQUE,
]

export const ENDED_BOOKING_REASONS: Record<EndedBookingReasonKey, EndedBookingReason> = {
  USED: { title: 'Réservation utilisée', icon: Valid, type: 'Valid' },
  CANCELLED_BY_OFFERER: { title: 'Annulée', icon: Wrong, type: 'Error' },
  ARCHIVED: { title: 'Réservation archivée', icon: Valid, type: 'Valid' },
  CANCELLED: { title: 'Réservation annulée', icon: Wrong, type: 'Error' },
}
