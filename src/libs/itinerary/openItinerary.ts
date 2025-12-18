import { showLocation } from 'react-native-map-link'

export async function openItinerary(address: string) {
  return showLocation({
    address,
    dialogTitle: 'Obtenir l’itinéraire',
    dialogMessage: 'Choisissez votre application de navigation',
    cancelText: 'Annuler',
    appsWhiteList: ['apple-maps', 'google-maps', 'waze'],
  })
}
