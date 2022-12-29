import { BusinessModule, RecommendedOffersModule } from 'features/home/types'
import {
  adaptBusinessModule,
  adaptRecommendationModule,
} from 'libs/contentful/adapters/adaptHomepageModules'
import { businessNatifModuleFixture } from 'libs/contentful/fixtures/BusinessModule.fixture'
import { recommendationNatifModuleFixture } from 'libs/contentful/fixtures/RecommendationNatifModule.fixture'

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
})
