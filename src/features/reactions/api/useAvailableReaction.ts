import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SubcategoryIdEnum } from 'api/gen'

type Booking = {
  name: string
  offerId: number
  subcategoryId: SubcategoryIdEnum
  dateUsed: string
  image?: string | null
}

type AvailableReactions = {
  numberOfReactableBookings: number
  bookings: Booking[]
}

const fetchAvailableReactions = async (): Promise<AvailableReactions> => {
  const response = await api.getNativeV1ReactionAvailable()
  const adaptedResponse: AvailableReactions = {
    numberOfReactableBookings: response?.numberOfReactableBookings || 0,
    bookings: response?.bookings || [],
  }

  return adaptedResponse
}

export const useAvailableReaction = () => {
  return useQuery<AvailableReactions>('availableReactions', fetchAvailableReactions)
}
