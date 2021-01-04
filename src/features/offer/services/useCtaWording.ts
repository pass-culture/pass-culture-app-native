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

export const useCtaWording = ({ offer }: Props) => {
  const { isLoggedIn } = useAuthContext()
  const { data: profileInfo } = useUserProfileInfo()
  if (!isLoggedIn || (profileInfo && !profileInfo.isBeneficiary))
    return offer?.category.categoryType === CategoryType.Event
      ? _(t`Accéder à la billetterie externe`)
      : _(t`Accéder à l'offre`)
  return isOfferExpired(offer) ? _(t`Offre expirée`) : _(t`Voir les disponibilités`)
}

export const isOfferExpired = (offer: OfferAdaptedResponse | undefined) =>
  offer?.stocks.every((stock) => {
    if (!stock.bookingLimitDatetime) return false
    return isTimestampExpired(Math.round(stock.bookingLimitDatetime?.valueOf() / 1000), 0)
  })
