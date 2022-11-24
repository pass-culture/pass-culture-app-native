import { useEffect, useState } from 'react'

import { useAlgoliaSimilarOffers } from 'features/offer/api/useAlgoliaSimilarOffers'
import { useUserProfileInfo } from 'features/profile/api'
import { env } from 'libs/environment'
import { GeoCoordinates } from 'libs/geolocation'
import { eventMonitoring } from 'libs/monitoring'

export const getSimilarOffersEndpoint = (
  offerId: number,
  userId?: number,
  position?: GeoCoordinates
): string | undefined => {
  let endpoint = `${env.RECOMMENDATION_ENDPOINT}/similar_offers/${offerId}?token=${env.RECOMMENDATION_TOKEN}`
  if (userId) endpoint += `&userId=${userId}`
  if (position) endpoint += `&longitude=${position.longitude}&latitude=${position.latitude}`
  return endpoint
}

export const useSimilarOffers = (offerId: number, position?: GeoCoordinates) => {
  const { data: profile } = useUserProfileInfo()
  const similarOffersEndpoint = getSimilarOffersEndpoint(offerId, profile?.id, position) as string
  const [similarOffersIds, setSimilarOffersIds] = useState<string[]>()

  useEffect(() => {
    if (!similarOffersEndpoint) return
    ;(async () => {
      try {
        const response = await fetch(similarOffersEndpoint)
        const data = await response.json()
        setSimilarOffersIds(data.results)
      } catch (e) {
        eventMonitoring.captureException(e)
      }
    })()
  })

  return useAlgoliaSimilarOffers(similarOffersIds || [])
}
