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
  })
})
