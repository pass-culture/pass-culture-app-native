import { t } from '@lingui/macro'
import { Platform, Share } from 'react-native'

import { VenueResponse } from 'api/gen'
import { generateLongFirebaseDynamicLink, WEBAPP_NATIVE_REDIRECTION_URL } from 'features/deeplinks'
import { DeeplinkPath, DeeplinkPathWithPathParams } from 'features/deeplinks/enums'
import { useWebAppUrl, WEBAPP_V1_URL, WEBAPP_V2_URL } from 'libs/environment'
import { MonitoringError } from 'libs/monitoring'

import { useVenue } from '../api/useVenue'

export function getWebappVenueUrl(venueId: number, webAppUrl: string) {
  const path = new DeeplinkPathWithPathParams(DeeplinkPath.VENUE, {
    id: venueId.toString(),
  }).getFullPath()
  if (webAppUrl === WEBAPP_V2_URL) {
    return `${webAppUrl}/${path}`
  }
  if (webAppUrl === WEBAPP_V1_URL) {
    return `${WEBAPP_NATIVE_REDIRECTION_URL}/${path}`
  }
  throw new MonitoringError(
    `webAppUrl=${webAppUrl} should be equal to WEBAPP_V2_URL=${WEBAPP_V2_URL} or WEBAPP_V1_URL=${WEBAPP_V1_URL}`
  )
}

const shareVenue = async (venue: VenueResponse, webAppUrl: string) => {
  const message = t({
    id: 'share venue message',
    values: { name: venue.name },
    message: 'Retrouve "{name}" sur le pass Culture',
  })

  const fullWebAppUrlWithParams = getWebappVenueUrl(venue.id, webAppUrl)
  const url = generateLongFirebaseDynamicLink(fullWebAppUrlWithParams)

  // url share content param is only for iOs, so we add url in message for android
  const completeMessage = Platform.OS === 'ios' ? message : message.concat(`\n\n${url}`)

  const shareContent = {
    message: completeMessage,
    url, // iOs only
    title: message, // android only
  }

  const shareOptions = {
    subject: message, // iOs only
    dialogTitle: message, // android only
  }

  await Share.share(shareContent, shareOptions)
}

export const useShareVenue = (venueId: number): (() => Promise<void>) => {
  const { data: venue } = useVenue(venueId)
  const webAppUrl = useWebAppUrl()

  return async () => {
    if (!venue || !webAppUrl) return
    await shareVenue(venue, webAppUrl)
  }
}
