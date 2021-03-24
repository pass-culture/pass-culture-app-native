import { t } from '@lingui/macro'
import React from 'react'

import { FavoriteOfferResponse, UserProfileResponse } from 'api/gen'
import { Credit } from 'features/home/services/useAvailableCredit'
import { openExternalUrl } from 'features/navigation/helpers'
import { hasEnoughCredit } from 'features/offer/services/useHasEnoughCredit'
import { _ } from 'libs/i18n'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ExternalLinkSite } from 'ui/svg/icons/ExternalLinkSite'

interface Props {
  credit: Credit
  offer: FavoriteOfferResponse
  setOfferToBook: React.Dispatch<React.SetStateAction<FavoriteOfferResponse | null>>
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
  if (!props.user.isBeneficiary) {
    if (props.offer.isExpired || props.offer.isExhausted || isBookedOffer) {
      return null
    }
    return <BookExternallyButton url={props.offer.externalTicketOfficeUrl} />
  }

  // User is an ex-beneficiary == beneficiary with expired credit
  if (props.user.isBeneficiary && props.credit.isExpired) {
    if (isBookedOffer) {
      return <ButtonPrimary title={_(t`Offre réservée`)} buttonHeight="tall" disabled />
    }
    if (props.offer.isExpired || props.offer.isExhausted) {
      return null
    }
    if (isFreeOffer) {
      return <BookInAppButton onPress={() => props.setOfferToBook(props.offer)} />
    }
    return <BookExternallyButton url={props.offer.externalTicketOfficeUrl} />
  }

  // User is beneficiary
  if (isBookedOffer) {
    return <ButtonPrimary title={_(t`Offre réservée`)} buttonHeight="tall" disabled />
  }
  if (props.offer.isExpired) {
    return <ButtonPrimary title={_(t`Offre expirée`)} buttonHeight="tall" disabled />
  }
  if (props.offer.isExhausted) {
    return <ButtonPrimary title={_(t`Offre épuisée`)} buttonHeight="tall" disabled />
  }
  if (!isFreeOffer && !doesUserHaveEnoughCredit) {
    return <ButtonPrimary title={_(t`Crédit insuffisant`)} buttonHeight="tall" disabled />
  }
  return <BookInAppButton onPress={() => props.setOfferToBook(props.offer)} />
}

const BookInAppButton = ({ onPress }: { onPress: () => void }) => (
  <ButtonPrimary title={_(t`Réserver`)} onPress={onPress} buttonHeight="tall" />
)

const BookExternallyButton = ({ url }: { url: FavoriteOfferResponse['externalTicketOfficeUrl'] }) =>
  url ? (
    <ButtonPrimary
      title={_(t`Réserver`)}
      onPress={() => url && openExternalUrl(url)}
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
