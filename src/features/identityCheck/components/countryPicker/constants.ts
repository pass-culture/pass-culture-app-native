import { Country, CountryCode, FlagType } from 'react-native-country-picker-modal'

export const FLAG_TYPE = FlagType.EMOJI

export const METROPOLITAN_FRANCE: Country = {
  region: 'Europe',
  subregion: 'Western Europe',
  currency: ['EUR'],
  callingCode: ['33'],
  flag: FLAG_TYPE,
  name: 'France',
  cca2: 'FR',
}

export const ALLOWED_COUNTRY_CODES: CountryCode[] = [
  'FR',
  'MQ',
  'YT',
  'GP',
  'GF',
  'RE',
  'PM',
  'BL',
  'MF',
  'WF',
]
