import { t } from '@lingui/macro'
import { Platform } from 'react-native'

import { OfferResponse } from 'api/gen'
import { generateLongFirebaseDynamicLink } from 'features/deeplinks'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { humanizeId } from 'features/offer/services/dehumanizeId'
import { analytics } from 'libs/analytics'
import { env, useWebAppUrl, WEBAPP_V2_URL } from 'libs/environment'
import { MonitoringError } from 'libs/monitoring'
import { share } from 'libs/share'

import { useOffer } from '../api/useOffer'
import { getLocationName } from '../atoms/LocationCaption'

import { useFunctionOnce } from './useFunctionOnce'

function getOfferPath(id: number) {
  return getScreenPath('Offer', { id, from: 'offer', moduleName: undefined })
}

export function getWebappOfferUrl(offerId: number, webAppUrl: string) {
  if (webAppUrl === WEBAPP_V2_URL) {
    return `${webAppUrl}${getOfferPath(offerId)}`
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

  const deepLink = `${WEBAPP_V2_URL}${getOfferPath(offer.id)}`
  const webAppLink = getWebappOfferUrl(offer.id, webAppUrl)

  const url = generateLongFirebaseDynamicLink(deepLink, webAppLink)

  // url share content param is only for iOs, so we add url in message for android
  const completeMessage = Platform.OS === 'ios' ? message : message.concat(`\n\n${url}`)
  const title = t`Je t'invite à découvrir une super offre sur le pass Culture !`
  const shareContent = {
    message: completeMessage,
    url, // iOS only
    title, // android only
  }
  const shareOptions = {
    subject: title, // iOS only
    dialogTitle: title, // android only
  }
  await share(shareContent, shareOptions)
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
