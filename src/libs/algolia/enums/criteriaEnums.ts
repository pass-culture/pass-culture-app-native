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

export const CATEGORY_CRITERIA = {
  ALL: {
    label: 'Toutes les catégories',
    icon: 'ico-all',
    facetFilter: '',
  },
  CINEMA: {
    label: 'Cinéma',
    icon: 'ico-cinema',
    facetFilter: 'CINEMA',
  },
  EXHIBITION: {
    label: 'Visites, expositions',
    icon: 'ico-exposition',
    facetFilter: 'VISITE',
  },
  MUSIC: {
    label: 'Musique',
    icon: 'ico-music',
    facetFilter: 'MUSIQUE',
  },
  SHOW: {
    label: 'Spectacles',
    icon: 'ico-show',
    facetFilter: 'SPECTACLE',
  },
  LESSON: {
    label: 'Cours, ateliers',
    icon: 'ico-arts',
    facetFilter: 'LECON',
  },
  BOOK: {
    label: 'Livres',
    icon: 'ico-books',
    facetFilter: 'LIVRE',
  },
  FILM: {
    label: 'Films, séries, podcasts',
    icon: 'ico-movie',
    facetFilter: 'FILM',
  },
  PRESS: {
    label: 'Presse',
    icon: 'ico-newspaper',
    facetFilter: 'PRESSE',
  },
  VIDEO_GAME: {
    label: 'Jeux vidéos',
    icon: 'ico-video-game',
    facetFilter: 'JEUX_VIDEO',
  },
  CONFERENCE: {
    label: 'Conférences, rencontres',
    icon: 'ico-conference',
    facetFilter: 'CONFERENCE',
  },
  INSTRUMENT: {
    label: 'Instruments de musique',
    icon: 'ico-instrument',
    facetFilter: 'INSTRUMENT',
  },
}

// Map the facetFilter (in algolia) to the label displayed in the front
export const MAP_CATEGORY_TO_LABEL = {
  CINEMA: 'Cinéma',
  VISITE: 'Visite, exposition',
  MUSIQUE: 'Musique',
  SPECTACLE: 'Spectacle',
  LECON: 'Cours, atelier',
  LIVRE: 'Livre',
  FILM: 'Film, série, podcast',
  PRESSE: 'Presse',
  JEUX_VIDEO: 'Jeu vidéo',
  CONFERENCE: 'Conférence, rencontre',
  INSTRUMENT: 'Instrument',
}
