import { VenueResponse } from 'api/gen'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { WEBAPP_V2_URL } from 'libs/environment'
import { share } from 'libs/share/share'
import { ShareContent } from 'libs/share/types'

function getPoiUrl(id: number, utmMedium: string) {
  const path = getScreenPath('Poi', { id })
  return `${WEBAPP_V2_URL}${path}?utm_gen=product&utm_campaign=share_poi&utm_medium=${utmMedium}`
}

type Parameters = {
  poi?: VenueResponse
  utmMedium: string
}

export const getShareVenue = ({
  poi,
  utmMedium,
}: Parameters): {
  share: () => Promise<void>
  shareContent: ShareContent | null
} => {
  if (!poi) return { share: () => new Promise((r) => r()), shareContent: null }

  const url = getPoiUrl(poi.id, utmMedium)
  const venueName = poi.publicName || poi.name
  const body = `Retrouve "${venueName}" sur le pass Culture`

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
