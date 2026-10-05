import { Color } from 'features/home/types'
import { ArtistEditorialContentModel, ContentTypes } from 'libs/contentful/types'

export const artistEditorialModuleFixture: ArtistEditorialContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '5WgvNwbkdDj4BmtwYwWc9e',
    type: 'Entry',
    createdAt: '2022-06-08T12:41:09.558Z',
    updatedAt: '2022-10-05T15:07:48.551Z',
    environment: {
      sys: {
        id: 'testing',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 3,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: ContentTypes.ARTIST_EDITORIAL,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Son incroyable discographie',
    artistId: '05b6af23-84b1-43a3-b648-a74433400c70',
    color: Color.Information04,
    illustration: 'MusicSheet',
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
        title: 'Son incroyable discographie',
        hitsPerPage: 3,
      },
    },
  },
}
