import {
  OfferResponse,
  FavoriteOfferResponse,
  UserProfileResponse,
  YoungStatusType,
  YoungStatusResponse,
  SubscriptionStatus,
} from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useEndedBookingFromOfferId } from 'features/bookings/api'
import { OfferModal } from 'features/offer/enums'
import { useUserProfileInfo } from 'features/profile/api'
import { isUserUnderageBeneficiary } from 'features/profile/utils'
import { analytics } from 'libs/firebase/analytics'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Subcategory } from 'libs/subcategories/types'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'

import { useOffer } from '../../api/useOffer'
import { useHasEnoughCredit } from '../useHasEnoughCredit/useHasEnoughCredit'

const getIsBookedOffer = (
  offerId: FavoriteOfferResponse['id'],
  bookedOffersIds: UserProfileResponse['bookedOffers'] = {}
): boolean => bookedOffersIds[offerId] !== undefined

interface Props {
  isLoggedIn: boolean
  userStatus: YoungStatusResponse
  isBeneficiary: boolean
  offer: OfferResponse
  subcategory: Subcategory
  hasEnoughCredit: boolean
  bookedOffers: UserProfileResponse['bookedOffers']
  isUnderageBeneficiary: boolean
  isEndedUsedBooking?: boolean
  bottomBannerText?: string
  isDisabled?: boolean
}
interface ICTAWordingAndAction {
  modalToDisplay?: OfferModal
  wording?: string
  navigateTo?: InternalNavigationProps['navigateTo']
  externalNav?: ExternalNavigationProps['externalNav']
  onPress?: () => void
  isEndedUsedBooking?: boolean
  bottomBannerText?: string
  isDisabled?: boolean
}

// Follow logic of https://www.notion.so/Modalit-s-d-affichage-du-CTA-de-r-servation-dbd30de46c674f3f9ca9f37ce8333241
export const getCtaWordingAndAction = ({
  isLoggedIn,
  userStatus,
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

  if (!isLoggedIn) {
    return {
      modalToDisplay: OfferModal.AUTHENTICATION,
      wording: 'Réserver l’offre',
      isDisabled: false,
      onPress: () => {
        analytics.logConsultAuthenticationModal(offer.id)
      },
    }
  }

  if (userStatus.statusType === YoungStatusType.non_eligible && !externalTicketOfficeUrl) {
    return {
      wording: 'Réserver l’offre',
      bottomBannerText:
        'Tu ne peux pas réserver cette offre car tu n’es pas éligible au pass Culture.',
      isDisabled: true,
    }
  }

  if (isEndedUsedBooking) {
    return {
      modalToDisplay: OfferModal.BOOKING,
      wording: 'Réserver l’offre',
      isEndedUsedBooking,
      isDisabled: false,
    }
  }

  if (isAlreadyBookedOffer) {
    return {
      wording: 'Voir ma réservation',
      isDisabled: false,
      navigateTo: {
        screen: 'BookingDetails',
        params: { id: bookedOffers[offer.id] },
        fromRef: true,
      },
    }
  }

  if (userStatus.statusType === YoungStatusType.eligible) {
    const common = {
      wording: 'Réserver l’offre',
      isDisabled: false,
    }
    switch (userStatus.subscriptionStatus) {
      case SubscriptionStatus.has_to_complete_subscription:
        return {
          ...common,
          modalToDisplay: OfferModal.FINISH_SUBSCRIPTION,
          onPress: () => {
            analytics.logConsultFinishSubscriptionModal(offer.id)
          },
        }

      case SubscriptionStatus.has_subscription_pending:
        return {
          ...common,
          modalToDisplay: OfferModal.APPLICATION_PROCESSING,
          onPress: () => {
            analytics.logConsultApplicationProcessingModal(offer.id)
          },
        }

      case SubscriptionStatus.has_subscription_issues:
        return {
          ...common,
          modalToDisplay: OfferModal.ERROR_APPLICATION,
          onPress: () => {
            analytics.logConsultErrorApplicationModal(offer.id)
          },
        }
    }
  }

  // Non beneficiary or educational offer or unavailable offer for user
  const isOfferCategoryNotBookableByUser = isUnderageBeneficiary && offer.isForbiddenToUnderage
  if (!isLoggedIn || !isBeneficiary || offer.isEducational || isOfferCategoryNotBookableByUser) {
    if (!externalTicketOfficeUrl) return { wording: undefined }

    return {
      wording: 'Accéder au site partenaire',
      externalNav: { url: externalTicketOfficeUrl },
      isDisabled: false,
    }
  }

  // Beneficiary
  if (!offer.isReleased || offer.isExpired) return { wording: 'Offre expirée', isDisabled: true }
  if (offer.isSoldOut) return { wording: 'Offre épuisée', isDisabled: true }

  if (!subcategory.isEvent) {
    if (!hasEnoughCredit) {
      if (offer.isDigital && !isUnderageBeneficiary)
        return { wording: 'Crédit numérique insuffisant', isDisabled: true }
      return { wording: 'Crédit insuffisant', isDisabled: true }
    }

    return {
      modalToDisplay: OfferModal.BOOKING,
      wording: 'Réserver l’offre',
      isDisabled: false,
      onPress: () => {
        analytics.logClickBookOffer(offer.id)
      },
    }
  }

  if (subcategory.isEvent) {
    if (!hasEnoughCredit) return { wording: 'Crédit insuffisant', isDisabled: true }

    return {
      modalToDisplay: OfferModal.BOOKING,
      wording: 'Voir les disponibilités',
      isDisabled: false,
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

  const { isBeneficiary = false, bookedOffers = {}, status } = user || {}
  const userStatus = status?.statusType ? status : { statusType: YoungStatusType.non_eligible }
  return getCtaWordingAndAction({
    isLoggedIn,
    userStatus,
    isBeneficiary,
    offer,
    subcategory: mapping[offer.subcategoryId],
    hasEnoughCredit,
    bookedOffers,
    isEndedUsedBooking: !!endedBooking?.dateUsed,
    isUnderageBeneficiary,
  })
}
