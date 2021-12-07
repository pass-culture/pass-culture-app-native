import { openUrl } from 'features/navigation/helpers'

export function openGoogleMapsItinerary(address: string) {
  const encodedAddress = encodeURIComponent(address)
  openUrl(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`)
}
