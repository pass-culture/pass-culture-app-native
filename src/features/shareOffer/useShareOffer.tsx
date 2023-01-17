import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'

import { OfferResponse } from 'api/gen'
import { getOfferUrl } from 'features/shareOffer/helpers/getOfferUrl'
import { analytics } from 'libs/firebase/analytics'
import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { share } from 'libs/share'
import { WebShareModal } from 'libs/share/WebShareModal'
import { getOfferLocationName } from 'shared/offers/getOfferLocationName'
import { useModal } from 'ui/components/modals/useModal'
import { useDebounce } from 'ui/hooks/useDebounce'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

type Props = {
  offer?: OfferResponse
}

type ShareOfferOutput = {
  share: () => void
  WebShareModal: FunctionComponent
}

const shareTitle = "Je t'invite à découvrir une super offre sur le pass Culture\u00a0!"
const shareOptions = {
  subject: shareTitle, // iOS only
  dialogTitle: shareTitle, // android only
}

export const useShareOffer = ({ offer: offer2 }: Props): ShareOfferOutput => {
  const offer = useDebounce(offer2, 1000)
  console.log({ offer })
  const { hideModal, showModal, visible } = useModal()

  const logShareOffer = useFunctionOnce(() => {
    if (offer) {
      return analytics.logShareOffer(offer.id)
    }
  })

  if (!offer) {
    return {
      share() {
        // do nothing when we don't have an offer
      },
      WebShareModal: () => {
        console.log('websharemodal', { visible })
        return (
          <WebShareModal
            key="ma-cle"
            shareContent={shareContent}
            dismissModal={hideModal}
            headerTitle="Partager l’offre"
            visible={visible}
          />
        )
      },
    }
  }

  const shareUrl = getOfferUrl(offer.id)
  const locationName = getOfferLocationName(offer.venue, offer.isDigital)
  const message = `Retrouve "${offer.name}" chez "${locationName}" sur le pass Culture`
  const shareAndroidMessage = message.concat(`${DOUBLE_LINE_BREAK}${shareUrl}`)
  const shareMessage = Platform.OS === 'android' ? shareAndroidMessage : message

  const shareContent = {
    message: shareMessage,
    url: shareUrl,
    title: shareTitle,
  }

  return {
    share() {
      showModal()
      logShareOffer()
      share(shareContent, shareOptions)
    },
    WebShareModal: () => {
      console.log('websharemodal', { visible })
      return (
        <WebShareModal
          key="ma-cle"
          shareContent={shareContent}
          dismissModal={hideModal}
          headerTitle="Partager l’offre"
          visible={visible}
        />
      )
    },
  }
}
