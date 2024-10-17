import { useLocation } from 'libs/location'

export enum Currency {
  EURO = '€',
  FRANC_PACIFIQUE = 'CFP',
}

export const useGetCurrentCurrency = (): Currency => {
  const { selectedPlace } = useLocation()

  if (selectedPlace?.info === 'Nouvelle-Calédonie') return Currency.FRANC_PACIFIQUE
  return Currency.EURO
}
