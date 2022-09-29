import React from 'react'

import { FavoriteOfferResponse, UserProfileResponse } from 'api/gen'
import { hasEnoughCredit } from 'features/offer/services/useHasEnoughCredit'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'

interface Props {
  offer: FavoriteOfferResponse
  onInAppBooking: (bookedOffer: FavoriteOfferResponse) => void
  user: UserProfileResponse
}

export const BookingButton: React.FC<Props> = (props) => {
  const isFreeOffer = getIsFreeOffer(props.offer)
  const isBookedOffer = getIsBookedOffer(props.offer.id, props.user.bookedOffers)
  const doesUserHaveEnoughCredit = hasEnoughCredit(
    props.offer.expenseDomains,
    props.offer.price || props.offer.startPrice,
    props.user.domainsCredit
  )

  // User is NOT beneficiary
  if (!isUserBeneficiary(props.user)) {
    if (
      !props.offer.isReleased ||
      props.offer.isExpired ||
      props.offer.isSoldOut ||
      isBookedOffer
    ) {
      return null
    }
    return (
      <BookExternallyButton
        url={props.offer.externalTicketOfficeUrl}
        offerId={props.offer.id}
        offerName={props.offer.name}
      />
    )
  }

  // User is an ex-beneficiary
  if (isUserExBeneficiary(props.user)) {
    if (isBookedOffer) {
      return <ButtonPrimary wording="Offre réservée" buttonHeight="tall" disabled />
    }
    if (!props.offer.isReleased || props.offer.isExpired || props.offer.isSoldOut) {
      return null
    }
    if (isFreeOffer) {
      return (
        <BookInAppButton
          offerName={props.offer.name}
          onPress={() => props.onInAppBooking(props.offer)}
        />
      )
    }
    return (
      <BookExternallyButton
        url={props.offer.externalTicketOfficeUrl}
        offerId={props.offer.id}
        offerName={props.offer.name}
      />
    )
  }

  // User is beneficiary
  if (isBookedOffer) {
    return <ButtonPrimary wording="Offre réservée" buttonHeight="tall" disabled />
  }
  if (!props.offer.isReleased || props.offer.isExpired) {
    return <ButtonPrimary wording="Offre expirée" buttonHeight="tall" disabled />
  }
  if (props.offer.isSoldOut) {
    return <ButtonPrimary wording="Offre épuisée" buttonHeight="tall" disabled />
  }
  if (!isFreeOffer && !doesUserHaveEnoughCredit) {
    return <ButtonPrimary wording="Crédit insuffisant" buttonHeight="tall" disabled />
  }
  return (
    <BookInAppButton
      offerName={props.offer.name}
      onPress={() => props.onInAppBooking(props.offer)}
    />
  )
}

const BookInAppButton = ({ offerName, onPress }: { offerName: string; onPress: () => void }) => (
  <ButtonPrimary
    wording="Réserver"
    accessibilityLabel={`Réserver l’offre ${offerName}`}
    onPress={onPress}
    buttonHeight="tall"
  />
)

const BookExternallyButton = ({
  url,
  offerId,
  offerName,
}: {
  url: FavoriteOfferResponse['externalTicketOfficeUrl']
  offerId: FavoriteOfferResponse['id']
  offerName: FavoriteOfferResponse['name']
}) =>
  url ? (
    <TouchableLink
      as={ButtonPrimary}
      wording="Réserver"
      accessibilityLabel={`Réserver l’offre ${offerName}`}
      externalNav={{ url, params: { analyticsData: { offerId } } }}
      icon={ExternalSite}
      buttonHeight="tall"
    />
  ) : null

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
