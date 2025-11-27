import { VenueResponse } from 'api/gen'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { share } from 'libs/share/share'
import { ShareContent } from 'libs/share/types'

function getVenueUrl(id: number, utmMedium: string) {
  const path = getScreenPath('Venue', { id })
  return `${WEBAPP_V2_URL}${path}?utm_gen=product&utm_campaign=share_venue&utm_medium=${utmMedium}`
}

type Parameters = {
  venue?: Omit<VenueResponse, 'isVirtual'>
  utmMedium: string
}

export const getShareVenue = ({
  venue,
  utmMedium,
}: Parameters): {
  share: () => Promise<void>
  shareContent: ShareContent | null
} => {
  if (!venue) return { share: () => new Promise((r) => r()), shareContent: null }

  const url = getVenueUrl(venue.id, utmMedium)
  const body = `Retrouve "${venue.name}" sur le pass Culture`

  const shareContent = {
    url,
    body,
    subject: body,
  }

  return {
    share: () => share({ content: shareContent, mode: 'default' }),
    shareContent,
  }
}
