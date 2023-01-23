import { Platform } from 'react-native'

import { useOffer } from 'features/offer/api/useOffer'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { ShareOutput } from 'features/share/types'
import { share } from 'libs/share'
import { getOfferLocationName } from 'shared/offer/getOfferLocationName'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

const doNothingFn = () => {
  // do nothing when we don't have an offer
}

const shareTitle = "Je t'invite à découvrir une super offre sur le pass Culture\u00a0!"
const shareOptions = {
  subject: shareTitle, // iOS only
  dialogTitle: shareTitle, // android only
}

export const useShareOffer = (offerId: number): ShareOutput => {
  const { data: offer } = useOffer({ offerId })

  if (!offer)
    return {
      share: doNothingFn,
      shareContent: undefined,
    }

  const shareUrl = getOfferUrl(offer.id)
  const locationName = getOfferLocationName(offer.venue, offer.isDigital)
  const message = `Retrouve "${offer.name}" chez "${locationName}" sur le pass Culture`
  const shareAndroidMessage = message + DOUBLE_LINE_BREAK + shareUrl
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
