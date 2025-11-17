import type { ReadonlyDeep } from 'type-fest'

import { CitiesResponse } from 'libs/place/types'
import { toMutable } from 'shared/types/toMutable'

export const mockedSuggestedCities = toMutable([
  {
    nom: 'City 1',
    code: '00001',
    codeDepartement: '01',
    codeRegion: '',
    codesPostaux: ['00001'],
    population: 1500,
  },
  {
    nom: 'City 2',
    code: '00002',
    codeDepartement: '02',
    codeRegion: '',
    codesPostaux: ['00002'],
    population: 1500,
  },
] as const satisfies ReadonlyDeep<CitiesResponse>)
