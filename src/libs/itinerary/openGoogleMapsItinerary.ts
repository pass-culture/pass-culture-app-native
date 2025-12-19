import { openUrl } from 'features/navigation/helpers/openUrl'

export function getGoogleMapsItineraryUrl(address: string) {
  const encodedAddress = encodeURIComponent(address)
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
}

export async function openGoogleMapsItinerary(address: string) {
  await openUrl(getGoogleMapsItineraryUrl(address))
}
