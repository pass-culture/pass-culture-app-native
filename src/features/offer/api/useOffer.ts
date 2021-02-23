import { useQuery } from 'react-query'

import { api } from 'api/api'
import { OfferResponse } from 'api/gen'

export interface OfferAdaptedResponse extends OfferResponse {
  fullAddress: string | null
}

const isNotEmpty = (text: string | undefined | null) => text !== undefined && text !== ''

export const formatFullAddress = (
  publicName: string | undefined | null,
  name: string,
  address: string | undefined | null,
  postalCode: string | undefined | null,
  city: string | undefined | null
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
  if (!offerId) return
  const offerApiResponse = await api.getnativev1offerofferId(offerId)
  return adaptOfferResponse(offerApiResponse)
}

export const useOffer = ({ offerId }: { offerId: number }) =>
  useQuery<OfferAdaptedResponse | undefined>(['offer', offerId], () => getOfferById(offerId))
