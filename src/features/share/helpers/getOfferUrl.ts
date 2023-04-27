import { generateLongFirebaseDynamicLink } from 'features/deeplinks/helpers'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { WEBAPP_V2_URL } from 'libs/environment'

export function getOfferUrl(id: number, urlType: 'universal' | 'dynamic' = 'universal'): string {
  const path = getScreenPath('Offer', { id })

  const universalLink = `${WEBAPP_V2_URL}${path}`
  if (urlType === 'dynamic') return generateLongFirebaseDynamicLink(universalLink)

  return universalLink
}
