import { openGoogleMapsItinerary } from './openGoogleMapsItinerary'
import { UseItineraryResult } from './types'

export const useItinerary = (): UseItineraryResult => {
  return { navigateTo: openGoogleMapsItinerary }
}
