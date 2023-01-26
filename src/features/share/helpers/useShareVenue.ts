import { Platform } from 'react-native'

import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { ShareOutput } from 'features/share/types'
import { useVenue } from 'features/venue/api/useVenue'
import { WEBAPP_V2_URL } from 'libs/environment'
import { share } from 'libs/share'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

const doNothingFn = () => {
  // do nothing when we don't have a venue
}

function getVenueUrl(id: number) {
  const path = getScreenPath('Venue', { id })
  return `${WEBAPP_V2_URL}${path}`
}

export const useShareVenue = (venueId: number): ShareOutput => {
  const { data: venue } = useVenue(venueId)

  if (!venue)
    return {
      share: doNothingFn,
      shareContent: undefined,
    }

  const shareUrl = getVenueUrl(venue.id)
  const venueName = venue.publicName || venue.name
  const shareTitle = `Retrouve "${venueName}" sur le pass Culture`
  const shareAndroidMessage = shareTitle + DOUBLE_LINE_BREAK + shareUrl
  // url share content param is only for iOS, so we add url in message for android
  const shareMessage = Platform.OS === 'android' ? shareAndroidMessage : shareTitle

  const shareContent = {
    url: shareUrl,
    message: shareMessage,
    title: shareTitle,
  }

  const shareOptions = {
    subject: shareTitle, // iOS only
    dialogTitle: shareTitle, // android only
  }

  return {
    share: () => share(shareContent, shareOptions),
    shareContent,
  }
}
