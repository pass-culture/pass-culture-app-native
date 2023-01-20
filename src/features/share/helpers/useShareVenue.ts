import { Platform } from 'react-native'

import { VenueResponse } from 'api/gen'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { useVenue } from 'features/venue/api/useVenue'
import { WEBAPP_V2_URL } from 'libs/environment'
import { share, ShareContent } from 'libs/share'

export function getVenueUrl(id: number) {
  const path = getScreenPath('Venue', { id })
  return `${WEBAPP_V2_URL}${path}`
}

const getShareContentFromVenue = (venue: VenueResponse) => {
  const venueName = venue.publicName || venue.name
  const message = `Retrouve "${venueName}" sur le pass Culture`

  const url = getVenueUrl(venue.id)

  // url share content param is only for iOS, so we add url in message for android
  const completeMessage = Platform.OS === 'android' ? message.concat(`\n\n${url}`) : message

  return {
    message: completeMessage,
    url, // iOS only
    title: message, // android only
  }
}

const shareVenue = async (venue: VenueResponse) => {
  const shareContent = getShareContentFromVenue(venue)
  const shareOptions = {
    subject: shareContent.title, // iOS only
    dialogTitle: shareContent.title, // android only
  }
  await share(shareContent, shareOptions)
}

export const useShareVenue = (
  venueId: number
): { share: () => Promise<void>; shareContent?: ShareContent } => {
  const { data: venue } = useVenue(venueId)

  return {
    share: async () => {
      if (typeof venue === 'undefined') return
      await shareVenue(venue)
    },
    shareContent: venue && getShareContentFromVenue(venue),
  }
}
