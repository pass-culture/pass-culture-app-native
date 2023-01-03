import { formattedOffersModule } from 'features/home/fixtures/homepage.fixture'
import { HomepageModuleType, OffersModule } from 'features/home/types'
import { adaptOffersModule } from 'libs/contentful/adapters/modules/adaptOffersModule'
import {
  additionalAlgoliaParametersWithOffersFixture,
  additionalAlgoliaParametersWithoutOffersFixture,
  algoliaNatifModuleCoverFixture,
  algoliaNatifModuleFixture,
} from 'libs/contentful/fixtures/algoliaModules.fixture'
import { AlgoliaParameters, isAlgoliaContentModel } from 'libs/contentful/types'

describe('adaptOffersModule', () => {
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
})
