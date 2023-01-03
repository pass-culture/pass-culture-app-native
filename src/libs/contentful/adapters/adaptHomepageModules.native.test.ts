import {
  BusinessModule,
  ExclusivityModule,
  HomepageModuleType,
  OffersModule,
  RecommendedOffersModule,
  VenuesModule,
} from 'features/home/types'
import {
  adaptBusinessModule,
  adaptExclusivityModule,
  adaptHomepageNatifModules,
  adaptOffersModule,
  adaptRecommendationModule,
  adaptVenuesModule,
} from 'libs/contentful/adapters/adaptHomepageModules'
import {
  additionalAlgoliaParametersWithOffersFixture,
  additionalAlgoliaParametersWithoutOffersFixture,
  algoliaNatifModuleCoverFixture,
  algoliaNatifModuleFixture,
} from 'libs/contentful/fixtures/algoliaModules.fixture'
import { businessNatifModuleFixture } from 'libs/contentful/fixtures/businessModule.fixture'
import { exclusivityNatifModuleFixture } from 'libs/contentful/fixtures/exclusivityModule.fixture'
import { recommendationNatifModuleFixture } from 'libs/contentful/fixtures/recommendationNatifModule.fixture'
import { venuesNatifModuleFixture } from 'libs/contentful/fixtures/venuesModule.fixture'
import {
  AlgoliaParameters,
  isAlgoliaContentModel,
  isBusinessContentModel,
  isExclusivityContentModel,
  isRecommendationContentModel,
  isVenuesContentModel,
} from 'libs/contentful/types'

describe('adaptHomepageModules', () => {
  const formattedBusinessModule: BusinessModule = {
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
  const formattedVenuesModule: VenuesModule = {
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
  const formattedRecommendedOffersModule: RecommendedOffersModule = {
    type: HomepageModuleType.RecommendedOffersModule,
    id: '3sAqNrRMXUOES7tFyRFFO8',
    displayParameters: { title: 'Nos recos', layout: 'two-items', minOffers: 1 },
    recommendationParameters: undefined,
  }
  const formattedExclusivityModule: ExclusivityModule = {
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
  const formattedOffersModule: OffersModule = {
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

  it('should adapt a business module', () => {
    const rawBusinessModule = businessNatifModuleFixture

    expect(isBusinessContentModel(rawBusinessModule)).toBeTruthy()
    expect(adaptBusinessModule(rawBusinessModule)).toEqual(formattedBusinessModule)
  })
  it('should adapt a venues module', () => {
    const rawVenuesModule = venuesNatifModuleFixture

    expect(isVenuesContentModel(rawVenuesModule)).toBeTruthy()
    expect(adaptVenuesModule(rawVenuesModule)).toEqual(formattedVenuesModule)
  })

  it('should adapt a recommendedOffers module', () => {
    const rawRecommendationModule = recommendationNatifModuleFixture

    expect(isRecommendationContentModel(rawRecommendationModule)).toBeTruthy()
    expect(adaptRecommendationModule(rawRecommendationModule)).toEqual(
      formattedRecommendedOffersModule
    )
  })

  it('should adapt an exclusivity module', () => {
    const rawExclusivityNatifModule = exclusivityNatifModuleFixture

    expect(isExclusivityContentModel(rawExclusivityNatifModule)).toBeTruthy()
    expect(adaptExclusivityModule(rawExclusivityNatifModule)).toEqual(formattedExclusivityModule)
  })

  it('should adapt an offers module without additional offers', () => {
    const rawAlgoliaNatifModule = algoliaNatifModuleFixture

    expect(isAlgoliaContentModel(rawAlgoliaNatifModule)).toBeTruthy()
    expect(adaptOffersModule(rawAlgoliaNatifModule)).toEqual(formattedOffersModule)
  })

  it('should adapt an offers module with additional offers', () => {
    const rawAlgoliaNatifModule = {
      ...algoliaNatifModuleFixture,
      fields: {
        ...algoliaNatifModuleFixture.fields,
        additionalAlgoliaParameters: additionalAlgoliaParametersWithOffersFixture,
      },
    }

    const formattedOffersModule: OffersModule = {
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
        { title: 'Livre', isGeolocated: false, categories: ['Livres'], hitsPerPage: 10 },
        { title: 'Ciné', categories: ['Cinéma'], hitsPerPage: 2 },
        { title: 'Musique', isGeolocated: false, categories: ['Musique'], hitsPerPage: 2 },
      ],
    }
    expect(adaptOffersModule(rawAlgoliaNatifModule)).toEqual(formattedOffersModule)
  })

  // Prevent crash due to unpublished submodules on contentful
  it('should filter out unpublished modules', () => {
    const rawAlgoliaNatifModule = {
      ...algoliaNatifModuleFixture,
      fields: {
        ...algoliaNatifModuleFixture.fields,
        additionalAlgoliaParameters:
          additionalAlgoliaParametersWithoutOffersFixture as unknown as AlgoliaParameters[],
      },
    }

    const formattedOffersModule: OffersModule = {
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
    }
    expect(adaptOffersModule(rawAlgoliaNatifModule)).toEqual(formattedOffersModule)
  })

  it('should adapt an offers module with a cover', () => {
    const rawAlgoliaNatifModule = {
      ...algoliaNatifModuleFixture,
      fields: {
        ...algoliaNatifModuleFixture.fields,
        cover: algoliaNatifModuleCoverFixture,
      },
    }

    const formattedOffersModule: OffersModule = {
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
      cover:
        'https://images.ctfassets.net/2bg01iqy0isv/1IujqyX9w3ugcGGbKlolbp/d11cdb6d0dee5e6d3fb2b072031a01e7/i107848-eduquer-un-chaton.jpeg',
    }
    expect(adaptOffersModule(rawAlgoliaNatifModule)).toEqual(formattedOffersModule)
  })

  it('should adapt a list of HomepageNatifModules', () => {
    const rawHomepageNatifModules = [
      algoliaNatifModuleFixture,
      businessNatifModuleFixture,
      venuesNatifModuleFixture,
      exclusivityNatifModuleFixture,
      recommendationNatifModuleFixture,
    ]

    const formattedHomepageModules = [
      formattedOffersModule,
      formattedBusinessModule,
      formattedVenuesModule,
      formattedExclusivityModule,
      formattedRecommendedOffersModule,
    ]

    expect(adaptHomepageNatifModules(rawHomepageNatifModules)).toStrictEqual(
      formattedHomepageModules
    )
  })
})
