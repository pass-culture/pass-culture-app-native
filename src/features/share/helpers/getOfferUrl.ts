import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { WEBAPP_V2_URL } from 'libs/environment'

export function getOfferUrl(id: number, utmMedium: string): URL {
  const path = getScreenPath('Offer', { id })
  const url = new URL(path, WEBAPP_V2_URL)
  url.searchParams.set('utm_gen', 'product')
  url.searchParams.set('utm_campaign', 'share_offer')
  url.searchParams.set('utm_medium', utmMedium)
  return url
}
