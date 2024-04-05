import { ContentTypes, VenueMapBlockContentModel } from 'libs/contentful/types'

export const venueMapBlockContentModelFixture: VenueMapBlockContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '5Tzq8bP20RkPQexo7qNb9i',
    type: 'Entry',
    createdAt: '2024-04-04T14:24:53.660Z',
    updatedAt: '2024-04-04T14:24:53.660Z',
    environment: {
      sys: {
        id: 'testing',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 1,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: ContentTypes.VENUE_MAP_BLOCK,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Accès carte des lieux',
  },
}
