import { useQuery } from 'react-query'

import { api } from 'api/api'
import { OfferResponse } from 'api/gen'

interface OfferAdaptedResponse extends OfferResponse {
  fullAddress: string | null
}

interface UseOfferInterface {
  offerId: number | null
}

export const adaptOfferResponse = (offerApiResponse: OfferResponse): OfferAdaptedResponse => {
  const locationName = offerApiResponse.venue.publicName || offerApiResponse.venue.name
  const addressSecondPart = `${offerApiResponse.venue.postalCode} ${offerApiResponse.venue.city}`
  const fullAddress = offerApiResponse.venue.address
    ? `${locationName}, ${offerApiResponse.venue.address}, ${addressSecondPart}`
    : `${locationName}, ${addressSecondPart}`
  return {
    ...offerApiResponse,
    fullAddress,
  }
}

const getOfferById = async (offerId: string) => {
  const offerApiResponse = await api.getnativev1offerofferId(offerId.toString())
  return adaptOfferResponse(offerApiResponse)
}

export const useOffer = ({ offerId }: UseOfferInterface) => {
  return useQuery<OfferAdaptedResponse>(
    ['offer', offerId],
    //@ts-ignore: Query is enabled only if offerId is truthy
    () => getOfferById(offerId.toString()),
    { enabled: !!offerId }
  )
}
