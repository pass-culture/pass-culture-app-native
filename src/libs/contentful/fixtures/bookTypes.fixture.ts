import { ContentTypes, BookTypes } from 'libs/contentful/types'

export const bookTypesFixture: BookTypes = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '6buleHY9V6MDq9PM3kFlmh',
    type: 'Entry',
    createdAt: '2023-02-09T14:21:11.187Z',
    updatedAt: '2023-02-09T14:21:11.187Z',
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
        id: ContentTypes.BOOK_TYPES,
      },
    },
    locale: 'en-US',
  },
  fields: {
    bookTypes: ['Carrière/Concours', 'Scolaire & Parascolaire', 'Gestion/entreprise'],
  },
}
