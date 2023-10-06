import { FavoriteOfferResponse, UserProfileResponse, YoungStatusType } from 'api/gen'
import { getBeneficiaryBookingButtonProps } from 'features/favorites/helpers/getBeneficiaryBookingButtonProps'
import { getEligibleBookingButtonProps } from 'features/favorites/helpers/getEligibleBookingButtonProps'
import { isUserBeneficiary } from 'features/profile/helpers/isUserBeneficiary'
import { isUserExBeneficiary } from 'features/profile/helpers/isUserExBeneficiary'
import { OfferModal } from 'shared/offer/enums'
import { ExternalNavigationProps } from 'ui/components/touchableLink/types'

interface Props {
  offer: FavoriteOfferResponse
  onInAppBooking: (bookedOffer: FavoriteOfferResponse) => void
  user: UserProfileResponse
}

type GetBookingButtonProperties = {
  wording?: string
  disabled?: boolean
  onPress?: () => void
  externalNav?: ExternalNavigationProps['externalNav']
  accessibilityLabel?: string
  modalToDisplay?: OfferModal
}

const getBookExternallyButtonProps = (offer: FavoriteOfferResponse) => {
  if (!offer.externalTicketOfficeUrl) return
  return {
    wording: 'Réserver',
    accessibilityLabel: `Réserver l’offre ${offer.name}`,
    externalNav: {
      url: offer.externalTicketOfficeUrl,
      params: { analyticsData: { offerId: offer.id } },
    },
  }
}

export const getBookingButtonProperties = (
  props: Props
): GetBookingButtonProperties | undefined => {
  const isBookedOffer = getIsBookedOffer(props.offer.id, props.user.bookedOffers)
  const isFreeOffer = getIsFreeOffer(props.offer)

  const offerName = props.offer.name
  const bookInAppButtonProps = {
    wording: 'Réserver',
    accessibilityLabel: `Réserver l’offre ${offerName}`,
    onPress: () => props.onInAppBooking(props.offer),
  }

  const userStatus = props.user.status
  if (userStatus?.statusType === YoungStatusType.eligible) {
    return getEligibleBookingButtonProps(userStatus, props.offer.id)
  }

  if (!isUserBeneficiary(props.user)) {
    if (!props.offer.isReleased || props.offer.isExpired || props.offer.isSoldOut) {
      return
    }
    return getBookExternallyButtonProps(props.offer)
  }

  if (isUserExBeneficiary(props.user)) {
    if (isBookedOffer) {
      return {
        wording: 'Offre réservée',
        disabled: true,
      }
    }
    if (!props.offer.isReleased || props.offer.isExpired || props.offer.isSoldOut) {
      return
    }
    if (isFreeOffer) {
      return bookInAppButtonProps
    }
    return getBookExternallyButtonProps(props.offer)
  }

  return getBeneficiaryBookingButtonProps(
    props.offer,
    isFreeOffer,
    isBookedOffer,
    props.user,
    props.onInAppBooking
  )
}

function getIsFreeOffer(offer: FavoriteOfferResponse): boolean {
  if (typeof offer.price === 'number') {
    return offer.price === 0
  }
  if (typeof offer.startPrice === 'number') {
    return offer.startPrice === 0
  }
  return false
}

function getIsBookedOffer(
  offerId: FavoriteOfferResponse['id'],
  bookedOffersIds: UserProfileResponse['bookedOffers'] = {}
): boolean {
  return bookedOffersIds[offerId] !== undefined
}
