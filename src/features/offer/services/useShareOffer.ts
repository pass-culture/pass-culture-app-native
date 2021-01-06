import { t } from '@lingui/macro'
import { useRef } from 'react'
import { Share } from 'react-native'

import { OfferResponse } from 'api/gen'
import { DEEPLINK_DOMAIN } from 'features/deeplinks'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'

import { useOffer } from '../api/useOffer'
import { getLocationName } from '../atoms/LocationCaption'

const shareOffer = async (offer: OfferResponse) => {
  const { id, isDigital, name, venue } = offer
  const locationName = getLocationName(venue, isDigital)
  const title = _(t`Retrouve ${name} chez ${locationName} sur le pass Culture`)
  const url = `${DEEPLINK_DOMAIN}offer/?id=${id}`

  await Share.share({ message: `${title}: ${url}`, url, title }, { dialogTitle: title })
}

export const useShareOffer = (offerId: number): (() => Promise<void>) => {
  const hasShared = useRef<boolean>(false)
  const { data: offerResponse } = useOffer({ offerId })

  return async () => {
    if (!hasShared.current) {
      hasShared.current = true
      if (offerId) analytics.logShareOffer(offerId)
    }
    if (!offerResponse) return
    await shareOffer(offerResponse)
  }
}
