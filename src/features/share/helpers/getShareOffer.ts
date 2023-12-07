import { Platform } from 'react-native'

import { OfferResponse, OfferVenueResponse } from 'api/gen'
import { formatShareOfferMessage } from 'features/share/helpers/formatShareOfferMessage'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { ShareOutput } from 'features/share/types'
import { share } from 'libs/share/share'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

const doNothingFn = () => {
  // do nothing when we don't have an offer
}

const shareTitle = 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!'
const shareOptions = {
  subject: shareTitle, // iOS only
  dialogTitle: shareTitle, // android only
}

type PartialOffer = {
  offerId: OfferResponse['id'] | undefined
  offerName: OfferResponse['name'] | undefined
  venueName: OfferVenueResponse['name'] | undefined
  utmMedium: string
}

export const getShareOffer = ({
  offerId,
  offerName,
  venueName,
  utmMedium,
}: PartialOffer): ShareOutput => {
  if (!offerId || !offerName || !venueName) {
    return {
      share: doNothingFn,
      shareContent: undefined,
    }
  }

  const messageWithoutLink = formatShareOfferMessage({
    offerName,
    venueName,
  })

  const shareUrl = getOfferUrl(offerId, utmMedium)
  const messageWithLink = messageWithoutLink + DOUBLE_LINE_BREAK + shareUrl
  // url share content param is only for iOS, so we add url in message for android
  const shareMessage = Platform.OS === 'android' ? messageWithLink : messageWithoutLink

  const shareContent = {
    url: shareUrl,
    messageWithoutLink,
    message: shareMessage,
    title: shareTitle,
  }

  return {
    share: () => share(shareContent, shareOptions),
    shareContent,
  }
}
