import {
  ExclusivityModule,
  HomepageModuleType,
  OffersModule,
  RecommendedOffersModule,
  BusinessModule,
  Homepage,
  VenuesModule,
  ThematicHighlightModule,
  CategoryListModule,
  ThematicHeaderType,
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
    subtitle: 'Ceci n’est pas une playlist de lieux',
    layout: 'one-item-medium',
    minOffers: 1,
  },
}

export const formattedRecommendedOffersModule: RecommendedOffersModule = {
  type: HomepageModuleType.RecommendedOffersModule,
  id: '2TD5BEKL2zUGLhfzhkWhwL',
  displayParameters: { title: 'Tes évènements en ligne', layout: 'two-items', minOffers: 1 },
  recommendationParameters: {
    categories: ['Cartes jeunes', 'Spectacles'],
    beginningDatetime: '2021-01-01T00:00+00:00',
    endingDatetime: '2024-01-01T00:00+00:00',
    upcomingWeekendEvent: true,
    eventDuringNextXDays: 5,
    currentWeekEvent: true,
    newestOnly: false,
    isEvent: true,
    priceMin: 0.99,
    priceMax: 99.99,
    subcategories: ['Livre', 'Livre numérique, e-book'],
    isDuo: false,
    isRecoShuffled: false,
    bookTypes: ['Carrière/Concours', 'Scolaire & Parascolaire', 'Gestion/entreprise'],
    movieGenres: ['ACTION', 'BOLLYWOOD'],
    musicTypes: ['Pop', 'Gospel'],
    showTypes: ['Humour / Café-théâtre', 'Opéra', 'Danse'],
  },
}

export const formattedThematicHighlightModule: ThematicHighlightModule = {
  type: HomepageModuleType.ThematicHighlightModule,
  id: '5Z1FGtRGbE3d1Q5oqHMfe9',
  subtitle: 'Avec son sous-titre',
  title: 'Temps très fort',
  imageUrl:
    'https://images.ctfassets.net/2bg01iqy0isv/6kYYW8Uwad2ZlLUmw1k4ax/9e1261e7010f4419506dc821b2d0bea8/be697ba0-3439-42fa-8f54-b917e988db66.jpeg',
  beginningDate: new Date('2022-12-21T23:00:00.000Z'),
  endingDate: new Date('2023-01-14T23:00:00.000Z'),
  toThematicHomeEntryId: '6DCThxvbPFKAo04SVRZtwY',
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
    {
      title: 'Livre',
      isGeolocated: false,
      categories: ['Cartes jeunes', 'Spectacles'],
      hitsPerPage: 10,
      minBookingsThreshold: 2,
      subcategories: ['Livre', 'Livre numérique, e-book'],
      movieGenres: ['ACTION', 'BOLLYWOOD'],
      musicTypes: ['Pop', 'Gospel'],
      showTypes: ['Humour / Café-théâtre', 'Opéra', 'Danse'],
      bookTypes: ['Carrière/Concours', 'Scolaire & Parascolaire', 'Gestion/entreprise'],
    },
  ],
  cover: undefined,
}

export const formattedCategoryListModule: CategoryListModule = {
  type: HomepageModuleType.CategoryListModule,
  id: '2TFHziway9rbBe6zvu64ZZ',
  title: 'Cette semaine sur le pass',
  categoryBlockList: [
    {
      id: '3tCepzu3UqlaZbeEFJROta',
      title: 'Livres',
      image:
        'https://images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
      homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
    },
    {
      id: '7s8Pcu34LbJytAIU1iZA0N',
      title: 'Cinéma',
      image:
        'https://images.ctfassets.net/2bg01iqy0isv/1IujqyX9w3ugcGGbKlolbp/d11cdb6d0dee5e6d3fb2b072031a01e7/i107848-eduquer-un-chaton.jpeg',
      homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
    },
  ],
}

export const adaptedHomepage: Homepage = {
  tags: [],
  id: '6DCThxvbPFKAo04SVRZtwY',
  thematicHeader: {
    type: ThematicHeaderType.Default,
    title: 'Un titre court',
    subtitle: 'Unsoustitretroplongquidépassebeaucoupbeaucoupbeaucoupbeaucoupbeaucoupbeaucoup',
  },
  modules: [
    formattedBusinessModule,
    formattedOffersModule,
    formattedExclusivityModule,
    formattedRecommendedOffersModule,
    formattedVenuesModule,
    formattedCategoryListModule,
    formattedThematicHighlightModule,
  ],
}
