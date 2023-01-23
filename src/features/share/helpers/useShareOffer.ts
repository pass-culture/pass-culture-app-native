import { Platform } from 'react-native'

import { OfferResponse } from 'api/gen'
import { useOffer } from 'features/offer/api/useOffer'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { share, ShareContent } from 'libs/share'
import { getOfferLocationName } from 'shared/offer/getOfferLocationName'

function getShareContentFromOffer(offer: OfferResponse) {
  const locationName = getOfferLocationName(offer.venue, offer.isDigital)
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

  return {
    share: async () => {
      if (typeof offer === 'undefined') return
      await shareOffer(offer)
    },
    shareContent: offer && getShareContentFromOffer(offer),
  }
}
