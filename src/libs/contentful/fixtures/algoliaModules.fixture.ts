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
      fields: { title: 'Livre', isGeolocated: false, categories: ['Livres'], hitsPerPage: 10 },
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
    fields: { title: 'Livre', isGeolocated: false, categories: ['Livres'], hitsPerPage: 10 },
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
    fields: { title: 'Ciné', categories: ['Cinéma'], hitsPerPage: 2 },
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
    fields: { title: 'Musique', isGeolocated: false, categories: ['Musique'], hitsPerPage: 2 },
  },
]

export const algoliaNatifModuleCoverFixture: AlgoliaContentModel['fields']['cover'] = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '1ZGleldomxaHjZeVZs6wCM',
    type: 'Entry',
    createdAt: '2022-11-25T15:42:23.711Z',
    updatedAt: '2022-11-25T15:42:23.711Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 1,
    contentType: {
      sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.INFORMATION },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Chaton',
    image: {
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
        id: '1IujqyX9w3ugcGGbKlolbp',
        type: 'Asset',
        createdAt: '2022-05-03T09:58:15.614Z',
        updatedAt: '2022-10-21T09:51:46.381Z',
        environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
        revision: 7,
        locale: 'en-US',
      },
      fields: {
        title: 'Test Sab',
        description: 'dqqddsds',
        file: {
          url: '//images.ctfassets.net/2bg01iqy0isv/1IujqyX9w3ugcGGbKlolbp/d11cdb6d0dee5e6d3fb2b072031a01e7/i107848-eduquer-un-chaton.jpeg',
          details: { size: 378517, image: { width: 1000, height: 667 } },
          fileName: 'i107848-eduquer-un-chaton.jpeg',
          contentType: 'image/jpeg',
        },
      },
    },
  },
}
