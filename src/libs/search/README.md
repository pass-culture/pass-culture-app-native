# Migration from algolia to App Search

There are 3 types of search parameters:

1. the parameters in contentful
2. the parameters in the search state (see reducer)
3. the parameters used for the search engine (algolia => App Search)

We need clear interfaces for each one of them, and mapping function:

- from 1. to 2. (when we click on the button See More, we want to prepopulate the search reducer)
- from 1. to 3. (for the home page, to build the queries)
- from 2. to 3. (to query the search engine from the search page)

Note: we want our interfaces to be provider-agnostic. As a result, we will have:

- `SearchParametersFields`, `SearchParameters` and `SearchParametersQuery`.

```typescript
// Taken from https://app.contentful.com/spaces/2bg01iqy0isv/content_types/algoliaParameters/fields
interface SearchParametersFields {
  title: string
  isGeolocated?: boolean
  aroundRadius?: number
  categories?: string[]
  tags?: string[]
  isDigital?: boolean
  isThing?: boolean
  isEvent?: boolean
  beginningDatetime?: string
  endingDatetime?: string
  isFree?: boolean
  priceMin?: number
  priceMax?: number
  isDuo?: boolean
  newestOnly?: boolean
  hitsPerPage: number
}

interface SearchParameters {
  aroundRadius: number | null
  beginningDatetime: Date | null
  date: SelectedDate | null
  endingDatetime: Date | null
  hitsPerPage: number | null
  geolocation: { latitude: number; longitude: number } | null
  offerCategories: string[]
  offerIsDuo: boolean
  offerIsFree: boolean
  offerIsNew: boolean
  offerTypes: {
    isDigital: boolean
    isEvent: boolean
    isThing: boolean
  }
  priceRange: Range<number> | null
  locationType: LocationType
  timeRange: Range<number> | null
  tags: string[]
}

// The actual search state will have some additional values:
interface SearchState extends PartialSearchParameters {
  place: SuggestedPlace | null // used to choose a specific place
  showResults: boolean // used for displaying the results or the landing page
  query: string // query typed by the user
}

// depends on the provider (algolia or app search)
interface SearchParametersQuery {}
```

### Fields to remove in App Search

Champs inutiles:

- `offer.pk`
- `offer.musicSubType`
- `offer.showSubType`
- `offer.type`
- `offer.visa`
- `offer.withdrawalDetails`

### Fields to adapt in App Search

1. Pas d'objet nested:

Ex: `offerer.name` => `offerer_name`

2. Pas de lettre majuscule / caratères spéciaux
   > Field names can only contain lowercase letters, numbers, and underscores

Ex: `offer.rankingWeight` => `ranking_weight`

3. Changement de types

Ex:

- `"_geoloc": { "lat": 48.9263, "lng": 2.49008 }` => `geoloc: "48.9263, 2.49008"`
- `"_geoloc": { "lat": null, "lng": null }` => `geoloc: null`

### Before

```json
{
  "offer": {
    "author": null,
    "category": "PRESSE",
    "rankingWeight": null,
    "dateCreated": 1624537915.299662,
    "dates": [],
    "description": null,
    "id": "ANR24",
    "isbn": null,
    "isDigital": true,
    "isDuo": false,
    "isEvent": false,
    "isThing": true,
    "label": "Presse en ligne",
    "musicType": null,
    "name": "12ABOLIGNE",
    "performer": null,
    "prices": [0],
    "priceMin": 0,
    "priceMax": 0,
    "showType": null,
    "speaker": null,
    "stageDirector": null,
    "stocksDateCreated": [1624537921.156929],
    "tags": [],
    "times": [],
    "thumbUrl": "https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/D7UQ",
    "type": "Lire"
  },
  "offerer": { "name": "Bar des amis" },
  "venue": {
    "city": null,
    "departementCode": null,
    "name": "Le Sous-sol (Offre numérique)",
    "publicName": null
  },
  "_geoloc": { "lat": null, "lng": null },
  "objectID": "222126"
}
```

### After

```json
{
  "author": null,
  "category": "PRESSE",
  "ranking_weight": null,
  "date_created": 1624537915.299662,
  "dates": [],
  "description": null,
  "id": "ANR24",
  "isbn": null,
  "is_digital": true,
  "is_duo": false,
  "is_event": false,
  "is_thing": true,
  "label": "Presse en ligne",
  "music_type": null,
  "name": "12ABOLIGNE",
  "performer": null,
  "prices": [0],
  "price_min": 0,
  "price_max": 0,
  "show_type": null,
  "speaker": null,
  "stage_director": null,
  "stocks_date_created": [1624537921.156929],
  "tags": [],
  "times": [],
  "thumb_url": "https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/D7UQ",
  "type": "Lire",
  "offerer_name": "Bar des amis",
  "city": null,
  "venue_departement_code": null,
  "venue_name": "Le Sous-sol (Offre numérique)",
  "venue_public_name": null,
  "geoloc": null,
  "object_id": "222126"
}
```
