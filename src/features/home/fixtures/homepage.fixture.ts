import { highlightOfferModuleFixture as formattedHighlightOfferModule } from 'features/home/fixtures/highlightOfferModule.fixture'
import {
  BusinessModule,
  CategoryListModule,
  Color,
  Homepage,
  HomepageModuleType,
  HomepageTag,
  OffersModule,
  RecommendedOffersModule,
  ThematicHeaderType,
  ThematicHighlightModule,
  TrendsModule,
  VenuesModule,
  VideoCarouselModule,
} from 'features/home/types'
import { ContentTypes } from 'libs/contentful/types'

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
  imageWeb:
    'https://images.ctfassets.net/2bg01iqy0isv/1jedJLjdDiypJqBtO1sjH0/185ee9e6428229a15d4c047b862a95f8/image_web.jpeg',
  localizationArea: {
    latitude: 2,
    longitude: 40,
    radius: 20,
  },
  callToAction: undefined,
  date: undefined,
}

export const formattedNewBusinessModule: BusinessModule = {
  type: HomepageModuleType.BusinessModule,
  id: '20SId61p6EFTG7kgBTFrOb',
  analyticsTitle:
    'Crée un compte\u00a0! 15-18 [A MAINTENIR EN BLOC 2 et paramétré pour être visible seulement pour les non connectés]',
  title: 'Rencontre d’arles participe à notre concours',
  subtitle: 'Partage ta passion pour la photo et tente de gagner un super prix',
  shouldTargetNotConnectedUsers: true,
  url: 'https://passculture.app/creation-compte',
  image:
    'https://images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
  imageWeb:
    'https://images.ctfassets.net/2bg01iqy0isv/1jedJLjdDiypJqBtO1sjH0/185ee9e6428229a15d4c047b862a95f8/image_web.jpeg',
  localizationArea: {
    latitude: 2,
    longitude: 40,
    radius: 20,
  },
  callToAction: 'En savoir plus',
  date: 'Du 2 mai au 4 août',
}

export const formattedVenuesModule: VenuesModule = {
  type: HomepageModuleType.VenuesModule,
  id: '105MMz59tftcxXJICXt7ja',
  venuesParameters: {
    title: 'Exemple de playlist de lieux',
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
  recommendationParameters: undefined,
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
      color: Color.Gold,
    },
    {
      id: '7s8Pcu34LbJytAIU1iZA0N',
      title: 'Cinéma',
      image:
        'https://images.ctfassets.net/2bg01iqy0isv/1IujqyX9w3ugcGGbKlolbp/d11cdb6d0dee5e6d3fb2b072031a01e7/i107848-eduquer-un-chaton.jpeg',
      homeEntryId: '6DCThxvbPFKAo04SVRZtwY',
      color: Color.SkyBlue,
    },
  ],
}

export const formattedVideoCarouselModule: VideoCarouselModule = {
  id: '3wfVCUGOPYBIKggC0nkJW1',
  type: HomepageModuleType.VideoCarouselModule,
  title: 'Test carousel video',
  color: Color.Lilac,
  items: [
    {
      id: '7ihPsS7RcX0WuLtCAJCI69',
      title: 'Une vidéo',
      youtubeVideoId: 'NsFmOttIW9Y',
      offerId: '1116',
      homeEntryId: undefined,
      tag: undefined,
      thematicHomeSubtitle: undefined,
      thematicHomeTag: undefined,
      thematicHomeTitle: undefined,
    },
  ],
}

export const formattedVideoCarouselModuleWithMultipleItems: VideoCarouselModule = {
  id: '3wfVCUGOPYBIKggC0nkJW1',
  type: HomepageModuleType.VideoCarouselModule,
  title: 'Test carousel video',
  color: Color.Lilac,
  items: [
    {
      id: '7ihPsS7RcX0WuLtCAJCI69',
      title: 'Quinzaine du ciné',
      youtubeVideoId: 'NsFmOttIW9Y',
      offerId: undefined,
      homeEntryId: '123456',
      tag: undefined,
      thematicHomeSubtitle: 'Les sorties du moment',
      thematicHomeTag: 'Cinéma',
      thematicHomeTitle: 'La quinzaine du ciné',
    },
    {
      id: '7ihPsS7RcX0WuLtCAJCI69',
      title: 'Une vidéo',
      youtubeVideoId: 'NsFmOttIW9Y',
      offerId: '1116',
      homeEntryId: undefined,
      tag: undefined,
      thematicHomeSubtitle: undefined,
      thematicHomeTag: undefined,
      thematicHomeTitle: undefined,
    },
  ],
}

export const formattedTrendsModule: TrendsModule = {
  id: 'g6VpeYbOosfALeqR55Ah6',
  type: HomepageModuleType.TrendsModule,
  items: [
    {
      homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
      id: '6dn0unOv4tRBNfOebVHOOy',
      image: { testUri: '../../../src/features/home/images/map.png' },
      title: 'Accès carte des lieux',
      type: ContentTypes.VENUE_MAP_BLOCK,
    },
    {
      homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
      id: '16ZgVwnOXvVc0N8ko9Kius',
      image: {
        uri: 'https://images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
      },
      title: 'Tendance 1',
      type: ContentTypes.TREND_BLOCK,
    },
    {
      homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
      id: '16ZgVwnOXvVc0N8ko9Kius',
      image: {
        uri: 'https://images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
      },
      title: 'Tendance 2',
      type: ContentTypes.TREND_BLOCK,
    },
    {
      homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
      id: '16ZgVwnOXvVc0N8ko9Kius',
      image: {
        uri: 'https://images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
      },
      title: 'Tendance 3',
      type: ContentTypes.TREND_BLOCK,
    },
  ],
}

const venueModules: VenuesModule[] = [formattedVenuesModule]
const emptyTags: HomepageTag[] = []

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
    formattedRecommendedOffersModule,
    formattedVenuesModule,
    formattedCategoryListModule,
    formattedThematicHighlightModule,
    formattedHighlightOfferModule,
  ],
}
export const highlightHeaderFixture = {
  modules: venueModules,
  id: 'fakeEntryId',
  thematicHeader: {
    type: ThematicHeaderType.Highlight,
    imageUrl:
      'https://images.ctfassets.net/2bg01iqy0isv/5PmtxKY77rq0nYpkCFCbrg/4daa8767efa35827f22bb86e5fc65094/photo-lion_noir-et-blanc_laurent-breillat-610x610.jpeg',
    subtitle: 'Un sous-titre',
    title: 'Bloc temps fort',
    beginningDate: new Date('2022-12-21T23:00:00.000Z'),
    endingDate: new Date('2023-01-14T23:00:00.000Z'),
  },
  tags: emptyTags,
} as const satisfies Homepage
