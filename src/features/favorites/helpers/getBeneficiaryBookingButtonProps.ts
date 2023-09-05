import { FavoriteOfferResponse, UserProfileResponse } from 'api/gen'
import { hasEnoughCredit } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'

export const getBeneficiaryBookingButtonProps = (
  offer: FavoriteOfferResponse,
  isFreeOffer: boolean,
  isBookedOffer: boolean,
  user: UserProfileResponse,
  onInAppBooking: (bookedOffer: FavoriteOfferResponse) => void
) => {
  const doesUserHaveEnoughCredit = hasEnoughCredit(
    offer.expenseDomains,
    offer.price ?? offer.startPrice,
    user.domainsCredit
  )
  if (isBookedOffer) {
    return {
      wording: 'Offre réservée',
      disabled: true,
    }
  }

  if (!offer.isReleased || offer.isExpired) {
    return {
      wording: 'Offre expirée',
      disabled: true,
    }
  }

  if (offer.isSoldOut) {
    return {
      wording: 'Offre épuisée',
      disabled: true,
    }
  }

  if (!isFreeOffer && !doesUserHaveEnoughCredit) {
    return {
      wording: 'Crédit insuffisant',
      disabled: true,
    }
  }

  return {
    wording: 'Réserver',
    accessibilityLabel: `Réserver l’offre ${offer.name}`,
    onPress: () => onInAppBooking(offer),
  }
}
