import { ArtistResponse } from 'api/gen'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { share } from 'libs/share/share'
import { ShareContent } from 'libs/share/types'

type Parameters = {
  artist?: ArtistResponse
  utmMedium: string
}

function getArtistUrl(id: string, utmMedium: string) {
  const path = getScreenPath('Artist', { id })
  return `${WEBAPP_V2_URL}${path}?utm_gen=product&utm_campaign=share_artist&utm_medium=${utmMedium}`
}

export const getShareArtist = ({
  artist,
  utmMedium,
}: Parameters): {
  share: () => Promise<void>
  shareContent: ShareContent | null
} => {
  if (!artist) return { share: () => new Promise((r) => r()), shareContent: null }

  const url = getArtistUrl(artist.id, utmMedium)
  const body = `Retrouve "${artist.name}" sur le pass Culture`

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
