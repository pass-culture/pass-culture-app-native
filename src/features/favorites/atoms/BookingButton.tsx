import { t } from '@lingui/macro'
import React from 'react'

import { FavoriteOfferResponse, UserProfileResponse } from 'api/gen'
import { openUrl } from 'features/navigation/helpers'
import { hasEnoughCredit } from 'features/offer/services/useHasEnoughCredit'
import { isUserBeneficiary, isUserExBeneficiary } from 'features/profile/utils'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'

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
      <BookExternallyButton url={props.offer.externalTicketOfficeUrl} offerId={props.offer.id} />
    )
  }

  // User is an ex-beneficiary
  if (isUserExBeneficiary(props.user)) {
    if (isBookedOffer) {
      return <ButtonPrimary title={t`Offre réservée`} buttonHeight="tall" disabled />
    }
    if (!props.offer.isReleased || props.offer.isExpired || props.offer.isSoldOut) {
      return null
    }
    if (isFreeOffer) {
      return <BookInAppButton onPress={() => props.onInAppBooking(props.offer)} />
    }
    return (
      <BookExternallyButton url={props.offer.externalTicketOfficeUrl} offerId={props.offer.id} />
    )
  }

  // User is beneficiary
  if (isBookedOffer) {
    return <ButtonPrimary title={t`Offre réservée`} buttonHeight="tall" disabled />
  }
  if (!props.offer.isReleased || props.offer.isExpired) {
    return <ButtonPrimary title={t`Offre expirée`} buttonHeight="tall" disabled />
  }
  if (props.offer.isSoldOut) {
    return <ButtonPrimary title={t`Offre épuisée`} buttonHeight="tall" disabled />
  }
  if (!isFreeOffer && !doesUserHaveEnoughCredit) {
    return <ButtonPrimary title={t`Crédit insuffisant`} buttonHeight="tall" disabled />
  }
  return <BookInAppButton onPress={() => props.onInAppBooking(props.offer)} />
}

const BookInAppButton = ({ onPress }: { onPress: () => void }) => (
  <ButtonPrimary title={t`Réserver`} onPress={onPress} buttonHeight="tall" />
)

const BookExternallyButton = ({
  url,
  offerId,
}: {
  url: FavoriteOfferResponse['externalTicketOfficeUrl']
  offerId: FavoriteOfferResponse['id']
}) =>
  url ? (
    <ButtonPrimary
      title={t`Réserver`}
      onPress={() => url && openUrl(url, { analyticsData: { offerId } })}
      icon={ExternalLinkSite}
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
