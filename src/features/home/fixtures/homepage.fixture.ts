import {
  ExclusivityModule,
  HomepageModuleType,
  OffersModule,
  RecommendedOffersModule,
  BusinessModule,
  Homepage,
  VenuesModule,
} from 'features/home/types'

export const formattedBusinessModule: BusinessModule = {
  type: HomepageModuleType.BusinessModule,
  id: '20SId61p6EFTG7kgBTFrOa',
  analyticsTitle:
    'Crée un compte\u00a0! 15-18 [A MAINTENIR EN BLOC 2 et paramétré pour être visible seulement pour les non connectés]',
  title: 'Débloque ton crédit\u00a0! ',
  subtitle: 'Termine ton inscription',
  shouldTargetNotConnectedUsers: true,
  url: 'https://passculture.app/creation-compte',
  image:
    'https://images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
  leftIcon: undefined,
}

export const formattedVenuesModule: VenuesModule = {
  type: HomepageModuleType.VenuesModule,
  id: '105MMz59tftcxXJICXt7ja',
  venuesParameters: [
    {
      title: 'Exemple de playlist de lieux',
      isGeolocated: false,
      venueTypes: [
        'Bibliothèque ou médiathèque',
        'Arts visuels, arts plastiques et galeries',
        'Centre culturel',
        'Cinéma - Salle de projections',
        'Cours et pratique artistiques',
        'Culture scientifique',
        'Festival',
        'Jeux / Jeux vidéos',
        'Librairie',
        'Magasin arts créatifs',
        'Musique - Disquaire',
        'Musique - Magasin d’instruments',
        'Musique - Salle de concerts',
        'Musée',
        'Offre numérique',
        'Patrimoine et tourisme',
        'Spectacle vivant',
        'Cinéma itinérant',
        'Autre type de lieu',
      ],
      hitsPerPage: 15,
    },
  ],
  displayParameters: {
    title: 'Exemple de playlist de lieux',
    subtitle: "Ceci n'est pas une playlist de lieux",
    layout: 'one-item-medium',
    minOffers: 1,
  },
}

export const formattedRecommendedOffersModule: RecommendedOffersModule = {
  type: HomepageModuleType.RecommendedOffersModule,
  id: '3sAqNrRMXUOES7tFyRFFO8',
  displayParameters: { title: 'Nos recos', layout: 'two-items', minOffers: 1 },
  recommendationParameters: undefined,
}

export const formattedExclusivityModule: ExclusivityModule = {
  type: HomepageModuleType.ExclusivityModule,
  id: 'AEYnm9QjIo2rZKoCfSvMD',
  title: 'WE FRAC CAEN',
  alt: 'Week-end FRAC',
  image:
    'https://images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
  url: undefined,
  offerId: 123456789,
  displayParameters: undefined,
}

export const formattedOffersModule: OffersModule = {
  type: HomepageModuleType.OffersModule,
  id: '2DYuR6KoSLElDuiMMjxx8g',
  title: 'Fais le plein de lecture',
  displayParameters: {
    title: 'Fais le plein de lecture avec notre partenaire ',
    subtitle: 'Tout plein de livres pour encore plus de fun sans que pour autant on en sache ',
    layout: 'two-items',
    minOffers: 1,
  },
  offersModuleParameters: [
    { title: 'Livre', isGeolocated: false, categories: ['Livres'], hitsPerPage: 10 },
  ],
  cover: undefined,
}

export const adaptedHomepage: Homepage = {
  tags: [],
  id: '6DCThxvbPFKAo04SVRZtwY',
  thematicHeader: {
    title: 'Un titre court',
    subtitle: 'Unsoustitretroplongquidépassebeaucoupbeaucoupbeaucoupbeaucoupbeaucoupbeaucoup',
  },
  modules: [
    formattedBusinessModule,
    formattedOffersModule,
    formattedExclusivityModule,
    formattedRecommendedOffersModule,
    formattedVenuesModule,
  ],
}
