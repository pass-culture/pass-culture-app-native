import { t } from '@lingui/macro'

import { CategoryType } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { isTimestampExpired } from 'libs/dates'
import { _ } from 'libs/i18n'

import { OfferAdaptedResponse } from '../api/useOffer'

interface Props {
  offer: OfferAdaptedResponse | undefined
}

export const useCtaWordingAndAction = ({ offer }: Props) => {
  const { isLoggedIn } = useAuthContext()
  const { data: profileInfo } = useUserProfileInfo()

  /* check I have all information to calculate wording
   * why: avoid flash on CTA wording
   */
  if (
    isLoggedIn === null ||
    profileInfo === null ||
    offer?.category.categoryType === null ||
    offer?.category.categoryType === undefined ||
    offer?.stocks.length === 0 ||
    offer?.stocks.length === undefined
  )
    return { wording: null, onPress: undefined }

  let wording = null
  let onPress = undefined

  // Non beneficiary
  if (!isLoggedIn || (profileInfo && !profileInfo.isBeneficiary)) {
    wording =
      offer?.category.categoryType === CategoryType.Event
        ? _(t`Accéder à la billetterie externe`)
        : _(t`Accéder à l'offre`)
    // $TODO: will be modified in ticket PC-6003
    // eslint-disable-next-line no-console
    onPress = () => console.log('Go to external offer')
    return { wording, onPress }
  }

  // Beneficiary

  // TODO: isOffer active

  if (isOfferSoldOut(offer)) {
    return {
      wording: _(t`Offre épuisée`),
      onPress: undefined,
    }
  }

  if (isOfferExpired(offer)) {
    return {
      wording: _(t`Offre expirée`),
      onPress: undefined,
    }
  }

  // TODO: check offer type

  /**
   * Things:
   * check user things credit
   * check is free
   * check platform
   * end: wording 'Réserver'
   */

  /**
   * Events:
   * check user events credit
   * end: wording 'Voir les disponibilités'
   */

  wording = _(t`Voir les disponibilités`)
  // $TODO: will be modified in ticket PC-5988
  // eslint-disable-next-line no-console
  onPress = () => console.log('Go to booking funnel')
  return { wording, onPress }
}

export const isOfferExpired = (offer: OfferAdaptedResponse | undefined) =>
  offer?.stocks.every((stock) => {
    if (!stock.bookingLimitDatetime) return false
    return isTimestampExpired(Math.round(stock.bookingLimitDatetime?.valueOf() / 1000), 0)
  })

export const isOfferSoldOut = (offer: OfferAdaptedResponse | undefined) =>
  offer?.stocks.every((stock) => !stock.isBookable)
