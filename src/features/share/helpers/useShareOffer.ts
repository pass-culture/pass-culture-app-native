import { Platform } from 'react-native'

import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { useShareOfferMessage } from 'features/share/helpers/useShareOfferMessage'
import { ShareOutput } from 'features/share/types'
import { share } from 'libs/share'
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
  const message = useShareOfferMessage(offerId)

  if (!message)
    return {
      share: doNothingFn,
      shareContent: undefined,
    }

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
