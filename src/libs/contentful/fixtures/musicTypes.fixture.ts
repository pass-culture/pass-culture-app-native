import { ContentTypes, MusicTypes } from 'libs/contentful/types'

export const musicTypesFixture: MusicTypes = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '4Jbbbk8OjWbTozEA7qLsZK',
    type: 'Entry',
    createdAt: '2023-02-07T16:03:45.398Z',
    updatedAt: '2023-02-07T16:23:57.923Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 2,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.MUSIC_TYPES } },
    locale: 'en-US',
  },
  fields: {
    musicTypes: ['Pop', 'Gospel'],
  },
}
