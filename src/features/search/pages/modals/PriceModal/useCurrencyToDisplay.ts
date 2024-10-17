import { useLocation } from 'libs/location'

export const useCurrencyToDisplay = () => {
  const { selectedPlace } = useLocation()
  const isNewCaledonianLocation = selectedPlace?.info === 'Nouvelle-Calédonie'

  return isNewCaledonianLocation ? 'CSP' : '€'
}
