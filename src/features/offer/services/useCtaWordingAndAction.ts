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
    offer?.stocks.length === 0
  )
    return { wording: null, onPress: undefined }

  let wording = null
  let onPress = undefined
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
  wording = isOfferExpired(offer) ? _(t`Offre expirée`) : _(t`Voir les disponibilités`)
  onPress = undefined
  return { wording, onPress }
}

export const isOfferExpired = (offer: OfferAdaptedResponse | undefined) =>
  offer?.stocks.every((stock) => {
    if (!stock.bookingLimitDatetime) return false
    return isTimestampExpired(Math.round(stock.bookingLimitDatetime?.valueOf() / 1000), 0)
  })
