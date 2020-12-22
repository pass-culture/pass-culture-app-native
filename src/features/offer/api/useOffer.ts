import { useQuery } from 'react-query'

import { api } from 'api/api'
import { OfferResponse } from 'api/gen'

export interface OfferAdaptedResponse extends OfferResponse {
  fullAddress: string | null
}

const isNotEmpty = (text: string | undefined) => text !== undefined && text !== ''

export const formatFullAddress = (
  publicName: string | undefined,
  name: string,
  address: string | undefined,
  postalCode: string | undefined,
  city: string | undefined
) => {
  let fullAddress = `${publicName || name}`
  if (isNotEmpty(address)) fullAddress = fullAddress.concat(`, ${address}`)
  if (isNotEmpty(postalCode) || isNotEmpty(city)) fullAddress = fullAddress.concat(',')
  if (isNotEmpty(postalCode)) fullAddress = fullAddress.concat(` ${postalCode}`)
  if (isNotEmpty(city)) fullAddress = fullAddress.concat(` ${city}`)
  return fullAddress
}

const adaptOfferResponse = (offerApiResponse: OfferResponse): OfferAdaptedResponse => ({
  ...offerApiResponse,
  fullAddress: formatFullAddress(
    offerApiResponse.venue.publicName,
    offerApiResponse.venue.name,
    offerApiResponse.venue.address,
    offerApiResponse.venue.postalCode,
    offerApiResponse.venue.city
  ),
})

const getOfferById = async (offerId: number) => {
  const offerApiResponse = await api.getnativev1offerofferId(offerId)
  return adaptOfferResponse(offerApiResponse)
}

export const useOffer = ({ offerId }: { offerId: number }) =>
  useQuery<OfferAdaptedResponse>(['offer', offerId], () => getOfferById(offerId))
