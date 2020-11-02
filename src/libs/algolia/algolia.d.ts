interface Offer {
  author?: string
  category?: string
  dateCreated?: number
  dates?: string[]
  description?: string
  id?: string
  isbn?: string
  isDigital?: boolean
  isDuo?: boolean
  isEvent?: boolean
  isThing?: boolean
  label?: string
  musicSubType?: string | null
  musicType?: string | null
  name?: string
  performer?: string | null
  prices?: number[]
  priceMin?: number
  priceMax?: number
  showSubType?: string | null
  showType?: string | null
  speaker?: string | null
  stageDirector?: string | null
  stocksDateCreated?: number[]
  thumbUrl?: string
  tags?: string[]
  times?: string[]
  type?: string
  visa?: string | null
  withdrawalDetails?: string | null
}

interface Offerer {
  name?: string
}

interface Venue {
  city?: string
  departementCode?: string
  name?: string
  publicName?: string | null
}

interface Geoloc {
  lat?: number
  lng?: number
}

export interface AlgoliaHit {
  offer: Offer
  offerer: Offerer
  venue: Venue
  _geoloc: Geoloc
  objectID: string
}
