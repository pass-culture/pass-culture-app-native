import { bookTypesFixture } from 'libs/contentful/fixtures/bookTypes.fixture'
import { categoriesFixture } from 'libs/contentful/fixtures/categoriesFixture'
import { movieGenresFixture } from 'libs/contentful/fixtures/movieGenres.fixture'
import { musicTypesFixture } from 'libs/contentful/fixtures/musicTypes.fixture'
import { showTypesFixture } from 'libs/contentful/fixtures/showTypes.fixture'
import { subcategoriesFixture } from 'libs/contentful/fixtures/subcategoriesEntry.fixture'
import { AlgoliaContentModel, AlgoliaParameters, ContentTypes } from 'libs/contentful/types'

// This fixture reflects the contentful data after the resolveResponse formatting
export const algoliaNatifModuleFixture: AlgoliaContentModel = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '2DYuR6KoSLElDuiMMjxx8g',
    type: 'Entry',
    createdAt: '2020-11-12T11:11:46.272Z',
    updatedAt: '2022-06-03T14:10:23.827Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 17,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.ALGOLIA } },
    locale: 'en-US',
  },
  fields: {
    title: 'Fais le plein de lecture',
    algoliaParameters: {
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
        id: 'XSfVIg1577cOcs23K6m3n',
        type: 'Entry',
        createdAt: '2020-11-12T11:10:41.542Z',
        updatedAt: '2022-06-03T14:11:30.186Z',
        environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
        revision: 38,
        contentType: {
          sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.ALGOLIA_PARAMETERS },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'Livre',
        algoliaCategories: categoriesFixture,
        hitsPerPage: 10,
        minBookingsThreshold: 2,
        algoliaSubcategories: subcategoriesFixture,
        musicTypes: musicTypesFixture,
        movieGenres: movieGenresFixture,
        showTypes: showTypesFixture,
        bookTypes: bookTypesFixture,
      },
    },
    displayParameters: {
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
        id: '7CPXxhWnNhT9LIxIGnHL9m',
        type: 'Entry',
        createdAt: '2020-11-12T11:10:24.065Z',
        updatedAt: '2022-07-26T07:19:25.766Z',
        environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
        revision: 19,
        contentType: {
          sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.DISPLAY_PARAMETERS },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'Fais le plein de lecture avec notre partenaire ',
        subtitle: 'Tout plein de livres pour encore plus de fun sans que pour autant on en sache ',
        layout: 'two-items',
        minOffers: 1,
      },
    },
  },
}
export const additionalAlgoliaParametersWithoutOffersFixture = [
  {
    sys: { type: 'Link', linkType: 'Entry', id: 'cwRBH9L0xQ2jPt90OAG7N' },
  },
]
export const additionalAlgoliaParametersWithOffersFixture: AlgoliaParameters[] = [
  {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
      id: 'XSfVIg1577cOcs23K6m3n',
      type: 'Entry',
      createdAt: '2020-11-12T11:10:41.542Z',
      updatedAt: '2022-06-03T14:11:30.186Z',
      environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
      revision: 38,
      contentType: {
        sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.ALGOLIA_PARAMETERS },
      },
      locale: 'en-US',
    },
    fields: {
      title: 'Livre',
      algoliaCategories: categoriesFixture,
      hitsPerPage: 10,
    },
  },
  {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
      id: '3FdPxg6dYAyoQBuDT1RjQu',
      type: 'Entry',
      createdAt: '2020-11-11T16:59:31.535Z',
      updatedAt: '2021-06-01T08:49:01.368Z',
      environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
      revision: 40,
      contentType: {
        sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.ALGOLIA_PARAMETERS },
      },
      locale: 'en-US',
    },
    fields: { title: 'Ciné', algoliaCategories: categoriesFixture, hitsPerPage: 2 },
  },
  {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
      id: '1OKyCTUvCfgVhD8aYVufXE',
      type: 'Entry',
      createdAt: '2022-08-03T13:39:34.711Z',
      updatedAt: '2022-08-03T13:39:34.711Z',
      environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
      revision: 1,
      contentType: {
        sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.ALGOLIA_PARAMETERS },
      },
      locale: 'en-US',
    },
    fields: {
      title: 'Musique',
      algoliaCategories: categoriesFixture,
      hitsPerPage: 2,
    },
  },
]
