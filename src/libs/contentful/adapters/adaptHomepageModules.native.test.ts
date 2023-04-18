import { cloneDeep } from 'lodash'

import {
  formattedBusinessModule,
  formattedCategoryListModule,
  formattedExclusivityModule,
  formattedOffersModule,
  formattedRecommendedOffersModule,
  formattedThematicHighlightModule,
  formattedVenuesModule,
} from 'features/home/fixtures/homepage.fixture'
import { adaptHomepageNatifModules } from 'libs/contentful/adapters/adaptHomepageModules'
import { algoliaNatifModuleFixture } from 'libs/contentful/fixtures/algoliaModules.fixture'
import { businessNatifModuleFixture } from 'libs/contentful/fixtures/businessModule.fixture'
import { categoryListFixture } from 'libs/contentful/fixtures/categoryList.fixture'
import { exclusivityNatifModuleFixture } from 'libs/contentful/fixtures/exclusivityModule.fixture'
import { recommendationNatifModuleFixture } from 'libs/contentful/fixtures/recommendationNatifModule.fixture'
import { thematicHighlightModuleFixture } from 'libs/contentful/fixtures/thematicHighlightModule.fixture'
import { venuesNatifModuleFixture } from 'libs/contentful/fixtures/venuesModule.fixture'
import { eventMonitoring } from 'libs/monitoring'

describe('adaptHomepageModules', () => {
  it('should adapt a list of HomepageNatifModules', () => {
    const rawHomepageNatifModules = [
      algoliaNatifModuleFixture,
      businessNatifModuleFixture,
      venuesNatifModuleFixture,
      exclusivityNatifModuleFixture,
      recommendationNatifModuleFixture,
      thematicHighlightModuleFixture,
      categoryListFixture,
    ]

    const formattedHomepageModules = [
      formattedOffersModule,
      formattedBusinessModule,
      formattedVenuesModule,
      formattedExclusivityModule,
      formattedRecommendedOffersModule,
      formattedThematicHighlightModule,
      formattedCategoryListModule,
    ]

    expect(adaptHomepageNatifModules(rawHomepageNatifModules)).toStrictEqual(
      formattedHomepageModules
    )
  }),
    it('should catch the error and log to Sentry if the provided data is corrupted', () => {
      const spyWarn = jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)

      const contentModel = cloneDeep(businessNatifModuleFixture)
      // @ts-ignore: the following content model is voluntarily broken (as it happened in the past), cf. PC-21362
      contentModel.fields.image.fields = undefined

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
