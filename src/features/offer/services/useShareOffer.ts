import { t } from '@lingui/macro'
import { useRef } from 'react'
import { Share } from 'react-native'

import { OfferResponse } from 'api/gen'
import { DEEPLINK_DOMAIN } from 'features/deeplinks'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'

import { useOffer } from '../api/useOffer'
import { getLocationName } from '../atoms/LocationCaption'

import { useCallbackOnce } from './useCallbackOnce'

const shareOffer = async (offer: OfferResponse) => {
  const { id, isDigital, name, venue } = offer
  const locationName = getLocationName(venue, isDigital)
  const title = _(t`Retrouve ${name} chez ${locationName} sur le pass Culture`)
  const url = `${DEEPLINK_DOMAIN}offer/?id=${id}`

  await Share.share({ message: title, url, title }, { dialogTitle: title })
}

export const useShareOffer = (offerId: number): (() => Promise<void>) => {
  const { data: offerResponse } = useOffer({ offerId })
  const { callbackOnce: logShareOffer } = useCallbackOnce(() => {
    analytics.logShareOffer(offerId)
  })

  return async () => {
    logShareOffer()
    if (!offerResponse) return
    await shareOffer(offerResponse)
  }
}
