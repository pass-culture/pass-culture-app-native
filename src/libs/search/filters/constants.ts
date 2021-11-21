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
  id = 'id',
  is_digital = 'is_digital',
  is_duo = 'is_duo',
  is_educational = 'is_educational',
  is_event = 'is_event',
  is_thing = 'is_thing',
  label = 'label',
  name = 'name',
  prices = 'prices',
  ranking_weight = 'ranking_weight',
  search_group_name = 'search_group_name',
  stocks_date_created = 'stocks_date_created',
  subcategory_id = 'subcategory_id',
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

// We don't use all the fields indexed. Simply retrieve the one we use.
export const RESULT_FIELDS: ResultFields<AppSearchFields> = {
  [AppSearchFields.dates]: { raw: {} },
  [AppSearchFields.id]: { raw: {} },
  [AppSearchFields.is_digital]: { raw: {} },
  [AppSearchFields.is_duo]: { raw: {} },
  [AppSearchFields.name]: { raw: {} },
  [AppSearchFields.subcategory_id]: { raw: {} },
  [AppSearchFields.prices]: { raw: {} },
  [AppSearchFields.thumb_url]: { raw: {} },
  [AppSearchFields.venue_position]: { raw: {} },
}

export const SORT_OPTIONS: Sort<AppSearchFields> = [
  { _score: 'desc' },
  { [AppSearchFields.ranking_weight]: 'desc' },
  { [AppSearchFields.date_created]: 'asc' },
]
