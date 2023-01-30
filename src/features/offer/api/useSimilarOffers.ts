import { useEffect, useState } from 'react'

import { Coordinates, SearchGroupNameEnumv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'

export const getSimilarOffersEndpoint = (
  offerId: number,
  userId?: number,
  position?: Coordinates,
  categories?: SearchGroupNameEnumv2[]
): string | undefined => {
  const endpoint = `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${offerId}?`
  const urlParams = new URLSearchParams()
  urlParams.set('token', env.RECOMMENDATION_TOKEN)
  if (userId) urlParams.set('userId', String(userId))
  if (position) {
    urlParams.set('longitude', String(position.longitude))
    urlParams.set('latitude', String(position.latitude))
  }
  if (categories) categories.forEach((category) => urlParams.append('categories', category))
  return endpoint + urlParams.toString()
}

export const useSimilarOffers = (
  offerId: number,
  position?: Coordinates,
  categories?: SearchGroupNameEnumv2[]
) => {
  const { user: profile } = useAuthContext()
  const similarOffersEndpoint = getSimilarOffersEndpoint(
    offerId,
    profile?.id,
    position,
    categories
  ) as string
  const [similarOffersIds, setSimilarOffersIds] = useState<string[]>()

  useEffect(() => {
    if (!similarOffersEndpoint) return

    fetch(similarOffersEndpoint)
      .then((response) => response.json())
      .then((data) => setSimilarOffersIds(data.results))
      .catch((error) => eventMonitoring.captureException(error))
  }, [similarOffersEndpoint])

  return useAlgoliaSimilarOffers(similarOffersIds || [])
}
