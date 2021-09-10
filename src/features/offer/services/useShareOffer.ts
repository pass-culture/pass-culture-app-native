import { t } from '@lingui/macro'
import { Platform, Share } from 'react-native'

import { OfferResponse } from 'api/gen'
import { generateLongFirebaseDynamicLink } from 'features/deeplinks'
import { humanizeId } from 'features/offer/services/dehumanizeId'
import { analytics } from 'libs/analytics'
import { env, useWebAppUrl } from 'libs/environment'

import { useOffer } from '../api/useOffer'
import { getLocationName } from '../atoms/LocationCaption'

import { useFunctionOnce } from './useFunctionOnce'

const shareOffer = async (offer: OfferResponse, webUrl: string) => {
  const { id, isDigital, name, venue } = offer
  const locationName = getLocationName(venue, isDigital)
  const message = t({
    id: 'share offer message',
    values: { name, locationName },
    message: 'Retrouve "{name}" chez "{locationName}" sur le pass Culture',
  })

  const url = generateLongFirebaseDynamicLink(
    'offre',
    `https://${env.WEBAPP_V2_DOMAIN}`,
    `${id}`,
    `&ofl=${webUrl}/accueil/details/${humanizeId(id)}`
  )

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
  const webUrl = useWebAppUrl()

  const logShareOffer = useFunctionOnce(() => {
    analytics.logShareOffer(offerId)
  })

  return async () => {
    logShareOffer()
    if (!offerResponse || !webUrl) return
    await shareOffer(offerResponse, webUrl)
  }
}
