import { ResultFields, Sort } from '@elastic/app-search-javascript'

export const FALSE = 0
export const TRUE = 1

// List of fields stored in AppSearch
export enum AppSearchFields {
  artist = 'artist',
  category = 'category',
  date_created = 'date_created',
  dates = 'dates',
  description = 'description',
  group = 'group',
  is_digital = 'is_digital',
  is_duo = 'is_duo',
  is_educational = 'is_educational',
  is_event = 'is_event',
  is_thing = 'is_thing',
  label = 'label',
  name = 'name',
  id = 'id',
  prices = 'prices',
  ranking_weight = 'ranking_weight',
  stocks_date_created = 'stocks_date_created',
  tags = 'tags',
  times = 'times',
  thumb_url = 'thumb_url',
  offerer_name = 'offerer_name',
  venue_department_code = 'venue_department_code',
  venue_id = 'venue_id',
  venue_name = 'venue_name',
  venue_position = 'venue_position',
  venue_public_name = 'venue_public_name',
}

export enum AppSearchVenuesFields {
  name = 'name',
  offerer_name = 'offerer_name',
  venue_type = 'venue_type',
  position = 'position',
  description = 'description',
  id = 'id',
  audio_disability = 'audio_disability',
  mental_disability = 'mental_disability',
  motor_disability = 'motor_disability',
  visual_disability = 'visual_disability',
  email = 'email',
  phone_number = 'phone_number',
  website = 'website',
  facebook = 'facebook',
  twitter = 'twitter',
  instagram = 'instagram',
  snapchat = 'snapchat',
}

// We don't use all the fields indexed. Simply retrieve the one we use.
export const RESULT_FIELDS: ResultFields<AppSearchFields> = {
  [AppSearchFields.category]: { raw: {} },
  [AppSearchFields.dates]: { raw: {} },
  [AppSearchFields.id]: { raw: {} },
  [AppSearchFields.is_digital]: { raw: {} },
  [AppSearchFields.is_duo]: { raw: {} },
  [AppSearchFields.name]: { raw: {} },
  [AppSearchFields.prices]: { raw: {} },
  [AppSearchFields.thumb_url]: { raw: {} },
  [AppSearchFields.venue_position]: { raw: {} },
}

// We don't use all the fields indexed. Simply retrieve the one we use.
export const VENUES_RESULT_FIELDS: ResultFields<AppSearchVenuesFields> = {
  [AppSearchVenuesFields.id]: { raw: {} },
  [AppSearchVenuesFields.name]: { raw: {} },
  [AppSearchVenuesFields.venue_type]: { raw: {} },
  [AppSearchVenuesFields.position]: { raw: {} },
}

export const SORT_OPTIONS: Sort<AppSearchFields> = [
  { _score: 'desc' },
  { [AppSearchFields.ranking_weight]: 'desc' },
  { [AppSearchFields.date_created]: 'asc' },
]
