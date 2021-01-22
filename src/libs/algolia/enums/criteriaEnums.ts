import { CategoryNameEnum } from 'api/gen'

const GEOLOCATION_CRITERIA = {
  EVERYWHERE: {
    label: 'Partout',
    icon: 'ico-everywhere',
    requiresGeolocation: false,
  },
  AROUND_ME: {
    label: 'Autour de moi',
    icon: 'ico-around-me',
    requiresGeolocation: true,
  },
}

const SORT_CRITERIA = {
  RELEVANCE: {
    label: 'Pertinence',
    icon: 'ico-relevance',
    index: '',
    requiresGeolocation: false,
  },
  PRICE: {
    label: 'Prix',
    icon: 'ico-price',
    index: '_by_price',
    requiresGeolocation: false,
  },
}

export const GEOLOCATED_CRITERIA = {
  ...GEOLOCATION_CRITERIA,
  ...SORT_CRITERIA,
}

type CategoryCriteria = {
  ALL: {
    label: string
    icon: string
    facetFilter: ''
  }
} & {
  [category in CategoryNameEnum]: {
    label: string
    icon: string
    facetFilter: CategoryNameEnum
  }
}

export const CATEGORY_CRITERIA: CategoryCriteria = {
  ALL: {
    label: 'Toutes les catégories',
    icon: 'ico-all',
    facetFilter: '',
  },
  [CategoryNameEnum.CINEMA]: {
    label: 'Cinéma',
    icon: 'ico-cinema',
    facetFilter: CategoryNameEnum.CINEMA,
  },
  [CategoryNameEnum.VISITE]: {
    label: 'Visites, expositions',
    icon: 'ico-exposition',
    facetFilter: CategoryNameEnum.VISITE,
  },
  [CategoryNameEnum.MUSIQUE]: {
    label: 'Musique',
    icon: 'ico-music',
    facetFilter: CategoryNameEnum.MUSIQUE,
  },
  [CategoryNameEnum.SPECTACLE]: {
    label: 'Spectacles',
    icon: 'ico-show',
    facetFilter: CategoryNameEnum.SPECTACLE,
  },
  [CategoryNameEnum.LECON]: {
    label: 'Cours, ateliers',
    icon: 'ico-arts',
    facetFilter: CategoryNameEnum.LECON,
  },
  [CategoryNameEnum.LIVRE]: {
    label: 'Livres',
    icon: 'ico-books',
    facetFilter: CategoryNameEnum.LIVRE,
  },
  [CategoryNameEnum.FILM]: {
    label: 'Films, séries, podcasts',
    icon: 'ico-movie',
    facetFilter: CategoryNameEnum.FILM,
  },
  [CategoryNameEnum.PRESSE]: {
    label: 'Presse',
    icon: 'ico-newspaper',
    facetFilter: CategoryNameEnum.PRESSE,
  },
  [CategoryNameEnum.JEUXVIDEO]: {
    label: 'Jeux vidéos',
    icon: 'ico-video-game',
    facetFilter: CategoryNameEnum.JEUXVIDEO,
  },
  [CategoryNameEnum.CONFERENCE]: {
    label: 'Conférences, rencontres',
    icon: 'ico-conference',
    facetFilter: CategoryNameEnum.CONFERENCE,
  },
  [CategoryNameEnum.INSTRUMENT]: {
    label: 'Instruments de musique',
    icon: 'ico-instrument',
    facetFilter: CategoryNameEnum.INSTRUMENT,
  },
}
