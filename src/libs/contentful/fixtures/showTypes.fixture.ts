import { ContentTypes, ShowTypes } from 'libs/contentful/types'

export const showTypesFixture: ShowTypes = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '6xSgHHFwhtelGYBWqZvbdr',
    type: 'Entry',
    createdAt: '2023-02-09T10:04:29.040Z',
    updatedAt: '2023-02-09T10:04:29.040Z',
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
        id: ContentTypes.SHOW_TYPES,
      },
    },
    locale: 'en-US',
  },
  fields: {
    showTypes: ['Humour / Café-théâtre', 'Opéra', 'Danse'],
  },
}
