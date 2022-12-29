import {
  BusinessModule,
  ExclusivityModule,
  RecommendedOffersModule,
  VenuesModule,
} from 'features/home/types'
import {
  adaptBusinessModule,
  adaptExclusivityModule,
  adaptRecommendationModule,
  adaptVenuesModule,
} from 'libs/contentful/adapters/adaptHomepageModules'
import { businessNatifModuleFixture } from 'libs/contentful/fixtures/BusinessModule.fixture'
import { exclusivityNatifModuleFixture } from 'libs/contentful/fixtures/ExclusivityModule.fixture'
import { recommendationNatifModuleFixture } from 'libs/contentful/fixtures/RecommendationNatifModule.fixture'
import { venuesNatifModuleFixture } from 'libs/contentful/fixtures/VenuesModule.fixture'

describe('adaptHomepageModules', () => {
  it('should adapt a business module', () => {
    const rawBusinessModule = businessNatifModuleFixture

    const formattedBusinessModule: BusinessModule = {
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

    expect(adaptBusinessModule(rawBusinessModule)).toEqual(formattedBusinessModule)
  })
  it('should adapt a venues module', () => {
    const rawVenuesModule = venuesNatifModuleFixture

    const formattedVenuesModule: VenuesModule = {
      id: '105MMz59tftcxXJICXt7ja',
      venuesSearchParameters: [
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

    expect(adaptVenuesModule(rawVenuesModule)).toEqual(formattedVenuesModule)
  })

  it('should adapt a recommendedOffers module', () => {
    const rawRecommendationModule = recommendationNatifModuleFixture

    const formattedRecommendedOffersModule: RecommendedOffersModule = {
      id: '3sAqNrRMXUOES7tFyRFFO8',
      displayParameters: { title: 'Nos recos', layout: 'two-items', minOffers: 1 },
    }

    expect(adaptRecommendationModule(rawRecommendationModule)).toEqual(
      formattedRecommendedOffersModule
    )
  })

  it('should adapt an exclusivity module', () => {
    const rawExclusivityNatifModule = exclusivityNatifModuleFixture

    const formattedExclusivityModule: ExclusivityModule = {
      id: 'AEYnm9QjIo2rZKoCfSvMD',
      title: 'WE FRAC CAEN',
      alt: 'Week-end FRAC',
      image:
        'https://images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
      url: undefined,
      offerId: 123456789,
    }

    expect(adaptExclusivityModule(rawExclusivityNatifModule)).toEqual(formattedExclusivityModule)
  })
})
