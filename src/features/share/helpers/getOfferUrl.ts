import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { WEBAPP_V2_URL } from 'libs/environment'

export function getOfferUrl(id: number): string {
  const path = getScreenPath('Offer', { id })
  return `${WEBAPP_V2_URL}${path}`
}
