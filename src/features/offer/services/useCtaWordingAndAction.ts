import { OfferResponse, FavoriteOfferResponse, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useEndedBookingFromOfferId } from 'features/bookings/api'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserUnderageBeneficiary } from 'features/profile/utils'
import { analytics } from 'libs/firebase/analytics'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Subcategory } from 'libs/subcategories/types'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'

import { useOffer } from '../api/useOffer'

import { useHasEnoughCredit } from './useHasEnoughCredit'

const getIsBookedOffer = (
  offerId: FavoriteOfferResponse['id'],
  bookedOffersIds: UserProfileResponse['bookedOffers'] = {}
): boolean => bookedOffersIds[offerId] !== undefined

interface Props {
  isLoggedIn: boolean
  isBeneficiary: boolean
  offer: OfferResponse
  subcategory: Subcategory
  hasEnoughCredit: boolean
  bookedOffers: UserProfileResponse['bookedOffers']
  isUnderageBeneficiary: boolean
  isEndedUsedBooking?: boolean
}
interface ICTAWordingAndAction {
  showBookingModal?: boolean
  wording?: string
  navigateTo?: InternalNavigationProps['navigateTo']
  externalNav?: ExternalNavigationProps['externalNav']
  onPress?: () => void
  isEndedUsedBooking?: boolean
}

// Follow logic of https://www.notion.so/Modalit-s-d-affichage-du-CTA-de-r-servation-dbd30de46c674f3f9ca9f37ce8333241
export const getCtaWordingAndAction = ({
  isLoggedIn,
  isBeneficiary,
  offer,
  subcategory,
  hasEnoughCredit,
  bookedOffers,
  isUnderageBeneficiary,
  isEndedUsedBooking,
}: Props): ICTAWordingAndAction | undefined => {
  const { externalTicketOfficeUrl } = offer
  const isAlreadyBookedOffer = getIsBookedOffer(offer.id, bookedOffers)

  if (isEndedUsedBooking) {
    return {
      showBookingModal: true,
      wording: 'Réserver',
      isEndedUsedBooking,
      onPress() {
        return false
      },
    }
  }

  if (isAlreadyBookedOffer) {
    return {
      showBookingModal: false,
      wording: 'Voir ma réservation',
      navigateTo: {
        screen: 'BookingDetails',
        params: { id: bookedOffers[offer.id] },
        fromRef: true,
      },
    }
  }

  const isOfferCategoryNotBookableByUser = isUnderageBeneficiary && offer.isForbiddenToUnderage

  // Non beneficiary or educational offer or unavailable offer for user
  if (!isLoggedIn || !isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) {
    if (!externalTicketOfficeUrl) return { wording: undefined }

    return {
      showBookingModal: false,
      wording: subcategory.isEvent ? 'Accéder à la billetterie' : 'Accéder à l’offre',
      externalNav: { url: externalTicketOfficeUrl },
    }
  }

  // Beneficiary
  if (!offer.isReleased) return { wording: 'Offre expirée' }
  if (offer.isExpired) return { wording: 'Offre expirée' }
  if (offer.isSoldOut) return { wording: 'Offre épuisée' }

  if (!subcategory.isEvent) {
    if (!hasEnoughCredit) {
      if (offer.isDigital && !isUnderageBeneficiary)
        return { wording: 'Crédit numérique insuffisant' }
      return { wording: 'Crédit insuffisant' }
    }

    return {
      showBookingModal: true,
      wording: 'Réserver',
      onPress: () => {
        analytics.logClickBookOffer(offer.id)
      },
    }
  }

  if (subcategory.isEvent) {
    if (!hasEnoughCredit) return { wording: 'Crédit insuffisant' }

    return {
      showBookingModal: true,
      wording: 'Voir les disponibilités',
      onPress: () => {
        analytics.logConsultAvailableDates(offer.id)
      },
    }
  }
  return undefined
}

export const useCtaWordingAndAction = (props: {
  offerId: number
}): ICTAWordingAndAction | undefined => {
  const { offerId } = props
  const { isLoggedIn } = useAuthContext()
  const { data: user } = useUserProfileInfo()
  const { data: offer } = useOffer({ offerId })
  const hasEnoughCredit = useHasEnoughCredit(offerId)
  const isUnderageBeneficiary = isUserUnderageBeneficiary(user)
  const mapping = useSubcategoriesMapping()
  const { data: endedBooking } = useEndedBookingFromOfferId(offerId)

  if (!offer) return

  /* check I have all information to calculate wording
   * why: avoid flash on CTA wording
   * The venue.id is not available on Homepage, or wherever we click on an offer
   * and preload the Offer details page. As a result, checking that venue.id
   * exists is equivalent to making sure the API call is successful.
   */
  if (isLoggedIn === null || user === null || !offer.venue.id) return

  const { isBeneficiary = false, bookedOffers = {} } = user || {}
  return getCtaWordingAndAction({
    isLoggedIn,
    isBeneficiary,
    offer,
    subcategory: mapping[offer.subcategoryId],
    hasEnoughCredit,
    bookedOffers,
    isEndedUsedBooking: !!endedBooking?.dateUsed,
    isUnderageBeneficiary,
  })
}
