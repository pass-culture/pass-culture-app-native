import { Color } from 'features/home/types'
import { ContentTypes, ThematicCategoryInfo } from 'libs/contentful/types'

export const thematicCategoryInfoFixture: ThematicCategoryInfo = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '3IJm1DTZ0wBEmZl6jR2Z4K',
    type: 'Entry',
    createdAt: '2023-02-17T15:00:14.663Z',
    updatedAt: '2023-02-17T15:00:20.329Z',
    environment: {
      sys: {
        id: 'testing',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 2,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: ContentTypes.THEMATIC_CATEGORY_INFO,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'catégorie cinéma',
    displayedTitle: 'Cinéma',
    titleParts: ['vos', 'cinéma'],
    displayedSubtitle: 'Sous-titre cinéma',
    color: Color.Lilac,
    illustrationFilename: 'cinema',
  },
}
