import { Color } from 'features/home/types'
import { ArtistHighlightingContentModel, ContentTypes } from 'libs/contentful/types'

export const artistHighlightingModuleFixture: ArtistHighlightingContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '7xXCA0GB0nDxARLEUJYN0Y',
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
        id: ContentTypes.ARTIST_HIGHLIGHTING,
      },
    },
    locale: 'en-US',
  },
  fields: {
    artistId: '836a38c9-da23-40ad-b28d-d5337023590b',
    subtitle: 'Interprète',
    description:
      'En attendant la sortie de son nouvel album, retrouve l’intégralité de sa discographie.',
    color: Color.Information04,
  },
}
