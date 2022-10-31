import { Platform } from 'react-native'

import { OfferResponse } from 'api/gen'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { useOffer } from 'features/offer/api/useOffer'
import { getLocationName } from 'features/offer/helpers/getLocationName'
import { WEBAPP_V2_URL } from 'libs/environment'
import { analytics } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { share, ShareContent } from 'libs/share'

export function getOfferUrl(id: number): string {
  const path = getScreenPath('Offer', { id })
  return `${WEBAPP_V2_URL}${path}`
}

function getShareContentFromOffer(offer: OfferResponse) {
  const locationName = getLocationName(offer.venue, offer.isDigital)
  const message = `Retrouve "${offer.name}" chez "${locationName}" sur le pass Culture`
  const url = getOfferUrl(offer.id)

  // url share content param is only for iOS, so we add url in message for android
  const completeMessage = Platform.OS === 'android' ? message.concat(`\n\n${url}`) : message
  const title = "Je t'invite à découvrir une super offre sur le pass Culture\u00a0!"
  return {
    message: completeMessage,
    url, // iOS only
    title, // android only
  }
}

async function shareOffer(offer: OfferResponse) {
  const shareContent = getShareContentFromOffer(offer)
  const shareOptions = {
    subject: shareContent.title, // iOS only
    dialogTitle: shareContent.title, // android only
  }
  await share(shareContent, shareOptions)
}

export const useShareOffer = (
  offerId: number
): { share: () => Promise<void>; shareContent?: ShareContent } => {
  const { data: offer } = useOffer({ offerId })

  const logShareOffer = useFunctionOnce(() => {
    analytics.logShareOffer(offerId)
  })

  return {
    share: async () => {
      logShareOffer()
      if (typeof offer === 'undefined') return
      await shareOffer(offer)
    },
    shareContent: offer && getShareContentFromOffer(offer),
  }
}
