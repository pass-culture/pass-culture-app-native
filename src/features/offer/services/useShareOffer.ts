import { t } from '@lingui/macro'
import { Platform, Share } from 'react-native'

import { OfferResponse } from 'api/gen'
import { generateLongFirebaseDynamicLink } from 'features/deeplinks'
import { DeeplinkPath, DeeplinkPathWithPathParams } from 'features/deeplinks/enums'
import { humanizeId } from 'features/offer/services/dehumanizeId'
import { analytics } from 'libs/analytics'
import { env, useWebAppUrl, WEBAPP_V2_URL } from 'libs/environment'
import { MonitoringError } from 'libs/monitoring'

import { useOffer } from '../api/useOffer'
import { getLocationName } from '../atoms/LocationCaption'

import { useFunctionOnce } from './useFunctionOnce'

export function getWebappOfferUrl(offerId: number, webAppUrl: string) {
  if (webAppUrl === WEBAPP_V2_URL) {
    const path = new DeeplinkPathWithPathParams(DeeplinkPath.OFFER, { id: offerId.toString() })
    return `${webAppUrl}/${path.getFullPath()}`
  }
  if (webAppUrl === env.WEBAPP_URL) {
    return `${webAppUrl}/accueil/details/${humanizeId(offerId)}`
  }
  throw new MonitoringError(
    `webAppUrl=${webAppUrl} should be equal to WEBAPP_V2_URL=${WEBAPP_V2_URL} or env.WEBAPP_URL=${env.WEBAPP_URL}`
  )
}

async function shareOffer(offer: OfferResponse, webAppUrl: string) {
  const locationName = getLocationName(offer.venue, offer.isDigital)
  const message = t({
    id: 'share offer message',
    values: { name: offer.name, locationName },
    message: 'Retrouve "{name}" chez "{locationName}" sur le pass Culture',
  })
  const fullWebAppUrlWithParams = getWebappOfferUrl(offer.id, webAppUrl)
  const url = generateLongFirebaseDynamicLink(fullWebAppUrlWithParams)

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
  const webAppUrl = useWebAppUrl()

  const logShareOffer = useFunctionOnce(() => {
    analytics.logShareOffer(offerId)
  })

  return async () => {
    logShareOffer()
    if (!offerResponse || !webAppUrl) return
    await shareOffer(offerResponse, webAppUrl)
  }
}
