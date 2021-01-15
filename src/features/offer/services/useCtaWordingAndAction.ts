import { t } from '@lingui/macro'
import { Platform, PlatformOSType } from 'react-native'

import { CategoryType } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { openExternalUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'

import { OfferAdaptedResponse, useOffer } from '../api/useOffer'

import { getOfferPrice } from './getOfferPrice'

// TODO (squad profile: dehardcode those numbers)
const USER_CREDIT_THING = 30
const USER_CREDIT_EVENT = 30

interface Props {
  isLoggedIn: boolean
  isBeneficiary: boolean
  offer: OfferAdaptedResponse
  platform?: PlatformOSType
  creditThing?: number
  creditEvent?: number
}
interface ICTAWordingAndAction {
  wording: string | undefined
  onPress?: () => void
  shouldHideCTA?: boolean
}

// Follow logic of https://www.notion.so/Modalit-s-d-affichage-du-CTA-de-r-servation-dbd30de46c674f3f9ca9f37ce8333241
export const getCtaWordingAndAction = ({
  isLoggedIn,
  isBeneficiary,
  offer,
  platform = Platform.OS,
  creditThing = USER_CREDIT_THING,
  creditEvent = USER_CREDIT_EVENT,
}: Props): ICTAWordingAndAction | undefined => {
  const { category, externalTicketOfficeUrl } = offer

  // Non beneficiary
  if (!isLoggedIn || !isBeneficiary) {
    const isEvent = category.categoryType === CategoryType.Event
    if (!externalTicketOfficeUrl) return { wording: undefined }
    return {
      wording: isEvent ? _(t`Accéder à l'offre`) : _(t`Accéder à la billetterie externe`),
      onPress: () => openExternalUrl(externalTicketOfficeUrl),
    }
  }

  // Beneficiary
  if (!offer.isActive) return { wording: _(t`Offre expirée`) }
  if (isOfferSoldOut(offer)) return { wording: _(t`Offre épuisée`) }
  if (isOfferExpired(offer)) return { wording: _(t`Offre expirée`) }

  const price = getOfferPrice(offer.stocks)
  if (category.categoryType === CategoryType.Thing) {
    // We check the platform first so that the user doesn't try to add funds and come back
    if (price > 0 && platform === 'ios') return { wording: _(t`Impossible de réserver`) }
    if (price > creditThing) return { wording: _(t`Crédit insuffisant`) }

    return {
      wording: _(t`Réserver`),
      onPress: () => {
        analytics.logClickBookOffer(offer.id)
      },
    }
  }

  if (category.categoryType === CategoryType.Event) {
    if (price > creditEvent) return { wording: _(t`Crédit insuffisant`) }

    return {
      wording: _(t`Voir les disponibilités`),
      onPress: () => {
        analytics.logConsultAvailableDates(offer.id)
      },
    }
  }
  return
}

export const useCtaWordingAndAction = (props: {
  offerId: number
}): ICTAWordingAndAction | undefined => {
  const { offerId } = props
  const { isLoggedIn } = useAuthContext()
  const { data: profileInfo } = useUserProfileInfo()
  const { data: offer } = useOffer({ offerId })
  if (!offer) return

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

  const { isBeneficiary = false } = profileInfo || {}
  return getCtaWordingAndAction({ isLoggedIn, isBeneficiary, offer })
}

// An offer is expired if all its stock has an expiration date in the past
export const isOfferExpired = (offer: OfferAdaptedResponse) =>
  offer.stocks.every(({ bookingLimitDatetime }) =>
    bookingLimitDatetime ? bookingLimitDatetime < new Date() : false
  )

// An offer is sold out if none of its stock is bookable
export const isOfferSoldOut = (offer: OfferAdaptedResponse) =>
  offer.stocks.every(({ isBookable }) => !isBookable)
