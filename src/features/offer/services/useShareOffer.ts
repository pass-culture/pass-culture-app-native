import { t } from '@lingui/macro'
import { Platform, Share } from 'react-native'

import { OfferResponse } from 'api/gen'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment'

import { useOffer } from '../api/useOffer'
import { getLocationName } from '../atoms/LocationCaption'

import { useFunctionOnce } from './useFunctionOnce'

function getOfferPath(id: number) {
  return getScreenPath('Offer', { id, from: 'offer', moduleName: undefined })
}

async function shareOffer(offer: OfferResponse) {
  const locationName = getLocationName(offer.venue, offer.isDigital)
  const message = t({
    id: 'share offer message',
    values: { name: offer.name, locationName },
    message: 'Retrouve "{name}" chez "{locationName}" sur le pass Culture',
  })

  const url = `${WEBAPP_V2_URL}${getOfferPath(offer.id)}`

  // url share content param is only for iOs, so we add url in message for android
  const completeMessage = Platform.OS === 'ios' ? message : message.concat(`\n\n${url}`)
  const title = t`Je t'invite à découvrir une super offre sur le pass Culture !`
  const shareContent = {
    message: completeMessage,
    // iOs only
    url,
    // android only
    title,
  }

  const shareOptions = {
    // iOs only
    subject: title,
    // android only
    dialogTitle: title,
  }

  await Share.share(shareContent, shareOptions)
}

export const useShareOffer = (offerId: number): (() => Promise<void>) => {
  const { data: offerResponse } = useOffer({ offerId })

  const logShareOffer = useFunctionOnce(() => {
    analytics.logShareOffer(offerId)
  })

  return async () => {
    logShareOffer()
    if (!offerResponse) return
    await shareOffer(offerResponse)
  }
}
