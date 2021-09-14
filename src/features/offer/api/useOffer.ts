import { useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { OfferResponse, SubcategoriesResponseModel, SubcategoryResponseModel } from 'api/gen'
import { OfferNotFoundError } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { useSubcategories } from 'features/offer/api/useSubcategories'

export interface OfferAdaptedResponse extends OfferResponse {
  fullAddress: string | null
  subcategory?: SubcategoryResponseModel
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

const adaptOfferResponse = (offerApiResponse: OfferResponse, subcategory?: SubcategoryResponseModel): OfferAdaptedResponse => ({
  ...offerApiResponse,
  subcategory,
  fullAddress: formatFullAddress(
    offerApiResponse.venue.publicName,
    offerApiResponse.venue.name,
    offerApiResponse.venue.address,
    offerApiResponse.venue.postalCode,
    offerApiResponse.venue.city
  ),
})

async function getOfferById(offerId: number) {
  if (!offerId) {
    throw new OfferNotFoundError(offerId)
  }
  try {
    const offerApiResponse = await api.getnativev1offerofferId(offerId)

    return adaptOfferResponse(offerApiResponse)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw new OfferNotFoundError(offerId)
    }
    throw error
  }
}

export const useOffer = ({ offerId }: { offerId: number }) => {
  return useQuery<OfferAdaptedResponse | undefined>([QueryKeys.OFFER, offerId], () => {
    if (offerId) {
      return getOfferById(offerId)
    } else {
      return undefined
    }
  })
}

export const useOfferWithSubcategories = ({ offerId }: { offerId: number }) => {
  const { data: subcategories } = useSubcategories()
  const offerResponse = useOffer({ offerId })
  const subcategory = subcategories?.subcategories.find((subcategory: SubcategoryResponseModel) => subcategory.id === offerResponse.data?.subcategoryId)

  return {
    ...offerResponse,
    data: {
      ...offerResponse.data,
      subcategory
    }
  }
}
