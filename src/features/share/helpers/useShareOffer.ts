import { Platform } from 'react-native'

import { OfferResponse, OfferVenueResponse } from 'api/gen'
import { useOffer } from 'features/offer/api/useOffer'
import { formatShareOfferMessage } from 'features/share/helpers/formatShareOfferMessage'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { ShareOutput } from 'features/share/types'
import { share } from 'libs/share'
import { getOfferLocationName } from 'shared/offer/getOfferLocationName'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

const doNothingFn = () => {
  // do nothing when we don't have an offer
}

const shareTitle = 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!'
const shareOptions = {
  subject: shareTitle, // iOS only
  dialogTitle: shareTitle, // android only
}

export const useShareOffer = (offerId: number): ShareOutput => {
  const { data: offer } = useOffer({ offerId })

  return getShareOffer({
    offerId: offer?.id,
    offerName: offer?.name,
    venueName: offer ? getOfferLocationName(offer.venue, offer.isDigital) : undefined,
  })
}

type PartialOffer = {
  offerId: OfferResponse['id'] | undefined
  offerName: OfferResponse['name'] | undefined
  venueName: OfferVenueResponse['name'] | undefined
}

export const getShareOffer = ({ offerId, offerName, venueName }: PartialOffer): ShareOutput => {
  if (!offerId || !offerName || !venueName) {
    return {
      share: doNothingFn,
      shareContent: undefined,
    }
  }

  const message = formatShareOfferMessage({
    offerName,
    venueName,
  })

  const shareUrl = getOfferUrl(offerId)
  const shareAndroidMessage = message + DOUBLE_LINE_BREAK + shareUrl
  // url share content param is only for iOS, so we add url in message for android
  const shareMessage = Platform.OS === 'android' ? shareAndroidMessage : message

  const shareContent = {
    url: shareUrl,
    message: shareMessage,
    title: shareTitle,
  }

  return {
    share: () => share(shareContent, shareOptions),
    shareContent,
  }
}
