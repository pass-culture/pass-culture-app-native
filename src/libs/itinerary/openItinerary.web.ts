import { openGoogleMapsItinerary } from 'libs/itinerary/openGoogleMapsItinerary'

export async function openItinerary(address: string) {
  return openGoogleMapsItinerary(address)
}
