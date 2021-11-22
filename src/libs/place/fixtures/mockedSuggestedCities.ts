import { SuggestedCity } from 'libs/place'
import { CitiesResponse } from 'libs/place/useCities'

export const mockedSuggestedCities: CitiesResponse = [
  {
    nom: 'City 1',
    code: '',
    codeDepartement: '01',
    codeRegion: '',
    codesPostaux: ['00001'],
    population: 1500,
  },
  {
    nom: 'City 2',
    code: '',
    codeDepartement: '02',
    codeRegion: '',
    codesPostaux: ['00002'],
    population: 1500,
  },
]

export const mockedCitiesResult: SuggestedCity[] = [
  {
    name: 'Paris',
    code: '75000',
    postalCode: '75000',
  },
  {
    name: 'Lyon',
    code: '69000',
    postalCode: '69000',
  },
  {
    name: 'Saint-Étienne',
    code: '42000',
    postalCode: '42000',
  },
]
