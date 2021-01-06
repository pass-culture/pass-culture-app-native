import { t } from '@lingui/macro'
import { Platform, PlatformOSType } from 'react-native'

import { CategoryType, OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { openExternalUrl } from 'features/navigation/helpers'
import { _ } from 'libs/i18n'

import { OfferAdaptedResponse, useOffer } from '../api/useOffer'

// TODO (squad profile: dehardcode those numbers)
const USER_CREDIT_THING = 30
const USER_CREDIT_EVENT = 30

interface Props {
  isLoggedIn: boolean
  isBeneficiary: boolean
  offer: OfferResponse
  platform?: PlatformOSType
}
interface ICTAWordingAndAction {
  wording: string
  onPress?: () => void
}

// Follow logic of https://www.notion.so/Modalit-s-d-affichage-du-CTA-de-r-servation-dbd30de46c674f3f9ca9f37ce8333241
const getCtaWordingAndAction = ({
  isLoggedIn,
  isBeneficiary,
  offer,
  platform = Platform.OS,
}: Props): ICTAWordingAndAction | undefined => {
  const { category, externalTicketOfficeUrl } = offer

  // Non beneficiary
  if (!isLoggedIn || !isBeneficiary) {
    const wording =
      category.categoryType === CategoryType.Event
        ? _(t`Accéder à l'offre`)
        : _(t`Accéder à la billetterie externe`)

    if (!externalTicketOfficeUrl) return { wording }
    return { wording, onPress: () => openExternalUrl(externalTicketOfficeUrl) }
  }

  // Beneficiary
  if (!offer.isActive) return { wording: _(t`Offre expirée`) }
  if (isOfferSoldOut(offer.stocks)) return { wording: _(t`Offre épuisée`) }
  if (isOfferExpired(offer.stocks)) return { wording: _(t`Offre expirée`) }

  const price = getPrice(offer.stocks)
  if (category.categoryType === CategoryType.Thing) {
    if (price > USER_CREDIT_THING) return { wording: _(t`Crédit insuffisant`) }
    if (price > 0 && platform === 'ios') return { wording: _(t`Impossible de réserver`) }
  }

  if (category.categoryType === CategoryType.Event) {
    if (price > USER_CREDIT_EVENT) return { wording: _(t`Crédit insuffisant`) }
  }

  return {
    wording: _(t`Voir les disponibilités`),
    // eslint-disable-next-line no-console
    onPress: () => console.log('Go to booking funnel'),
  }
}

export const useCtaWordingAndAction = (props: {
  offerId: number
}): ICTAWordingAndAction | undefined => {
  const { offerId } = props
  const { isLoggedIn } = useAuthContext()
  const { data: profileInfo } = useUserProfileInfo()
  const { data: offer } = useOffer({ offerId })
  if (!offer || !profileInfo) return

  /* check I have all information to calculate wording
   * why: avoid flash on CTA wording
   */
  if (
    isLoggedIn === null ||
    profileInfo === null ||
    offer.category.categoryType === null ||
    offer.category.categoryType === undefined
  )
    return

  const { isBeneficiary } = profileInfo
  return getCtaWordingAndAction({ isLoggedIn, isBeneficiary, offer })
}

// An offer is expired if all its stock has an expiration date in the past
export const isOfferExpired = (stocks: OfferAdaptedResponse['stocks']) =>
  stocks.every(({ bookingLimitDatetime }) =>
    bookingLimitDatetime ? bookingLimitDatetime < new Date() : false
  )

// An offer is sold out if none of its stock is bookable
export const isOfferSoldOut = (stocks: OfferAdaptedResponse['stocks']) =>
  stocks.every(({ isBookable }) => !isBookable)

export const getPrice = (stocks: OfferAdaptedResponse['stocks']): number =>
  Math.min(...stocks.map(({ price }) => price))
