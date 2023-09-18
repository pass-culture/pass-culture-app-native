import { Country } from 'features/identityCheck/components/countryPicker/types'

export const METROPOLITAN_FRANCE: Country = {
  id: 'FR',
  callingCode: '33',
  name: 'France',
}

export const COUNTRIES: Country[] = [
  METROPOLITAN_FRANCE,
  {
    id: 'MQ',
    name: 'Martinique',
    callingCode: '596',
  },
  {
    id: 'YT',
    name: 'Mayotte',
    callingCode: '262',
  },
  {
    id: 'GP',
    name: 'Guadeloupe',
    callingCode: '590',
  },
  {
    id: 'GF',
    name: 'Guyane française',
    callingCode: '594',
  },
  {
    id: 'RE',
    name: 'La Réunion',
    callingCode: '262',
  },
  {
    id: 'PM',
    name: 'Saint-Pierre-et-Miquelon',
    callingCode: '508',
  },
  {
    id: 'BL',
    name: 'Saint-Barthélemy',
    callingCode: '590',
  },
  {
    id: 'MF',
    name: 'Saint-Martin',
    callingCode: '590',
  },
  {
    id: 'WF',
    name: 'Wallis-et-Futuna',
    callingCode: '681',
  },
]
