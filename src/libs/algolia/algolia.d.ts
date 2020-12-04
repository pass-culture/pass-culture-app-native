export enum AlgoliaCategory {
  CINEMA = 'CINEMA',
  VISITE = 'VISITE',
  MUSIQUE = 'MUSIQUE',
  SPECTACLE = 'SPECTACLE',
  LECON = 'LECON',
  LIVRE = 'LIVRE',
  FILM = 'FILM',
  PRESSE = 'PRESSE',
  JEUX_VIDEO = 'JEUX_VIDEO',
  CONFERENCE = 'CONFERENCE',
  INSTRUMENT = 'INSTRUMENT',
}

interface Offer {
  author?: string | null
  category: AlgoliaCategory | null
  dateCreated?: number
  dates?: number[]
  description?: string | null
  id: string
  isbn?: string | null
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
  times?: number[]
  type?: string
  visa?: string | null
  withdrawalDetails?: string | null
}

interface Offerer {
  name?: string
}

interface Venue {
  city?: string | null
  departementCode?: string | null
  name?: string | null
  publicName?: string | null
}

export interface Geoloc {
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
