import { t } from '@lingui/macro'
import { Platform, Share } from 'react-native'

import { VenueResponse } from 'api/gen'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { analytics } from 'libs/analytics'
import { WEBAPP_V2_URL } from 'libs/environment'
import { useFunctionOnce } from 'libs/hooks'

import { useVenue } from '../api/useVenue'

function getVenuePath(id: number) {
  return getScreenPath('Venue', { id })
}

const shareVenue = async (venue: VenueResponse) => {
  const message = t({
    id: 'share venue message',
    values: { name: venue.publicName || venue.name },
    message: 'Retrouve "{name}" sur le pass Culture',
  })

  const url = `${WEBAPP_V2_URL}${getVenuePath(venue.id)}`

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

  const logShareVenue = useFunctionOnce(() => {
    analytics.logShareVenue(venueId)
  })

  return async () => {
    logShareVenue()
    if (!venue) return
    await shareVenue(venue)
  }
}
