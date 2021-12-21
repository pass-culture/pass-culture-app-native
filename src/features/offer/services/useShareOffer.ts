import { t } from '@lingui/macro'
import { Platform } from 'react-native'

import { OfferResponse } from 'api/gen'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { useOffer } from 'features/offer/api/useOffer'
import { getLocationName } from 'features/offer/atoms/LocationCaption'
import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { share } from 'libs/share'

export function getOfferUrl(id: number): string {
  const path = getScreenPath('Offer', { id })
  return `${WEBAPP_V2_URL}${path}`
}

async function shareOffer(offer: OfferResponse) {
  const locationName = getLocationName(offer.venue, offer.isDigital)
  const message = t({
    id: 'share offer message',
    values: { name: offer.name, locationName },
    message: 'Retrouve "{name}" chez "{locationName}" sur le pass Culture',
  })

  const url = getOfferUrl(offer.id)

  // url share content param is only for iOs, so we add url in message for android
  const completeMessage = Platform.OS === 'ios' ? message : message.concat(`\n\n${url}`)
  const title = t`Je t'invite à découvrir une super offre sur le pass Culture\u00a0!`
  const shareContent = {
    message: completeMessage,
    url, // iOS only
    title, // android only
  }
  const shareOptions = {
    subject: title, // iOS only
    dialogTitle: title, // android only
  }
  await share(shareContent, shareOptions)
}

export const useShareOffer = (offerId: number): (() => Promise<void>) => {
  const { data: offer } = useOffer({ offerId })

  const logShareOffer = useFunctionOnce(() => {
    analytics.logShareOffer(offerId)
  })

  return async () => {
    logShareOffer()
    if (typeof offer === 'undefined') return
    await shareOffer(offer)
  }
}
