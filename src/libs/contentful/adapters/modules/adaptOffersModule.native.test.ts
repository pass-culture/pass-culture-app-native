import { formattedOffersModule } from 'features/home/fixtures/homepage.fixture'
import { HomepageModuleType, OffersModule } from 'features/home/types'
import { adaptOffersModule } from 'libs/contentful/adapters/modules/adaptOffersModule'
import {
  additionalAlgoliaParametersWithOffersFixture,
  additionalAlgoliaParametersWithoutOffersFixture,
  algoliaNatifModuleFixture,
} from 'libs/contentful/fixtures/algoliaModules.fixture'
import { AlgoliaFields, AlgoliaParameters, isAlgoliaContentModel } from 'libs/contentful/types'

describe('adaptOffersModule', () => {
  it('should adapt an offers module without additional offers', () => {
    const rawAlgoliaNatifModule = algoliaNatifModuleFixture

    expect(isAlgoliaContentModel(rawAlgoliaNatifModule)).toBe(true)

    expect(adaptOffersModule(rawAlgoliaNatifModule)).toEqual(formattedOffersModule)
  })

  it('should adapt an offers module with additional offers', () => {
    const rawAlgoliaNatifModule = {
      ...algoliaNatifModuleFixture,
      fields: {
        ...(algoliaNatifModuleFixture.fields as AlgoliaFields),
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
        {
          title: 'Livre',
          isGeolocated: false,
          categories: ['Cartes jeunes', 'Spectacles'],
          hitsPerPage: 10,
          subcategories: ['Livre', 'Livre numérique, e-book'],
          minBookingsThreshold: 2,
          musicTypes: ['Pop', 'Gospel'],
          movieGenres: ['ACTION', 'BOLLYWOOD'],
          showTypes: ['Humour / Café-théâtre', 'Opéra', 'Danse'],
          bookTypes: ['Carrière/Concours', 'Scolaire & Parascolaire', 'Gestion/entreprise'],
        },
        {
          title: 'Livre',
          isGeolocated: false,
          categories: ['Cartes jeunes', 'Spectacles'],
          hitsPerPage: 10,
        },
        { title: 'Ciné', categories: ['Cartes jeunes', 'Spectacles'], hitsPerPage: 2 },
        {
          title: 'Musique',
          isGeolocated: false,
          categories: ['Cartes jeunes', 'Spectacles'],
          hitsPerPage: 2,
        },
      ],
    }

    expect(adaptOffersModule(rawAlgoliaNatifModule)).toEqual(formattedOffersModule)
  })

  // Prevent crash due to unpublished submodules on contentful
  it('should filter out unpublished modules', () => {
    const rawAlgoliaNatifModule = {
      ...algoliaNatifModuleFixture,
      fields: {
        ...(algoliaNatifModuleFixture.fields as AlgoliaFields),
        additionalAlgoliaParameters:
          additionalAlgoliaParametersWithoutOffersFixture as unknown as AlgoliaParameters[],
      },
    }

    expect(adaptOffersModule(rawAlgoliaNatifModule)).toEqual(formattedOffersModule)
  })
})
