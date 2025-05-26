import {
  formattedBusinessModule,
  formattedCategoryListModule,
  formattedOffersModule,
  formattedRecommendedOffersModule,
  formattedThematicHighlightModule,
  formattedTrendsModule,
  formattedVenuesModule,
  formattedVideoCarouselModule,
} from 'features/home/fixtures/homepage.fixture'
import { adaptHomepageNatifModules } from 'libs/contentful/adapters/adaptHomepageModules'
import { algoliaNatifModuleFixture } from 'libs/contentful/fixtures/algoliaModules.fixture'
import { businessNatifModuleFixture } from 'libs/contentful/fixtures/businessModule.fixture'
import { categoryListFixture } from 'libs/contentful/fixtures/categoryList.fixture'
import { recommendationNatifModuleFixture } from 'libs/contentful/fixtures/recommendationNatifModule.fixture'
import { thematicHighlightModuleFixture } from 'libs/contentful/fixtures/thematicHighlightModule.fixture'
import { trendsModuleFixture } from 'libs/contentful/fixtures/trendsModule.fixture'
import { venuesNatifModuleFixture } from 'libs/contentful/fixtures/venuesModule.fixture'
import { videoCarouselFixture } from 'libs/contentful/fixtures/videoCarousel.fixture'
import { eventMonitoring } from 'libs/monitoring/services'

describe('adaptHomepageModules', () => {
  it('should adapt a list of HomepageNatifModules', () => {
    const rawHomepageNatifModules = [
      algoliaNatifModuleFixture,
      businessNatifModuleFixture,
      venuesNatifModuleFixture,
      recommendationNatifModuleFixture,
      thematicHighlightModuleFixture,
      categoryListFixture,
      videoCarouselFixture,
      trendsModuleFixture,
    ]

    const formattedHomepageModules = [
      formattedOffersModule,
      formattedBusinessModule,
      formattedVenuesModule,
      formattedRecommendedOffersModule,
      formattedThematicHighlightModule,
      formattedCategoryListModule,
      formattedVideoCarouselModule,
      formattedTrendsModule,
    ]

    expect(adaptHomepageNatifModules(rawHomepageNatifModules)).toStrictEqual(
      formattedHomepageModules
    )
  })

  it('should catch the error and log to Sentry if the provided data is corrupted', () => {
    const spyWarn = jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

    const contentModel = structuredClone(businessNatifModuleFixture)
    // @ts-ignore: the following content model is voluntarily broken, cf. PC-21362
    contentModel.fields.image = undefined

    adaptHomepageNatifModules([contentModel])

    expect(spyWarn).toHaveBeenNthCalledWith(
      1,
      'Error while computing home modules, with module of ID: 20SId61p6EFTG7kgBTFrOa',
      expect.objectContaining({}) // is supposed to be a TypeError, but we don't care
    )
    expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(
      1,
      'Error while computing home modules',
      { extra: { moduleId: '20SId61p6EFTG7kgBTFrOa' } }
    )
  })
})
