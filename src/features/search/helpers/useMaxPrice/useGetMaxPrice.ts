import { MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { useLocation } from 'libs/location'
import { DEFAULT_EURO_TO_XPF_RATE } from 'libs/parsers/useGetEuroToXPFRate'

export const useGetMaxPrice = (): number => {
  const { selectedPlace } = useLocation()
  const isNewCaledonianLocation = selectedPlace?.info === 'Nouvelle-Calédonie'

  return isNewCaledonianLocation ? MAX_PRICE * DEFAULT_EURO_TO_XPF_RATE : MAX_PRICE
}
