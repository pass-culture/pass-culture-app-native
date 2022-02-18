import { openUrl } from 'features/navigation/helpers'

export function getGoogleMapsItineraryUrl(address: string) {
  const encodedAddress = encodeURIComponent(address)
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
}

export function openGoogleMapsItinerary(address: string) {
  openUrl(getGoogleMapsItineraryUrl(address))
}
