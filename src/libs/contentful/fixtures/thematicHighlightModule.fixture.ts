import { thematicHighlightInfoFixture } from 'libs/contentful/fixtures/thematicHighlightInfo.fixture'
import { ContentTypes, ThematicHighlightContentModel } from 'libs/contentful/types'

export const thematicHighlightModuleFixture: ThematicHighlightContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '5Z1FGtRGbE3d1Q5oqHMfe9',
    type: 'Entry',
    createdAt: '2022-12-22T15:31:00.263Z',
    updatedAt: '2022-12-22T17:22:20.657Z',
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
        id: ContentTypes.THEMATIC_HIGHLIGHT,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Temps fort Hugo',
    thematicHomeEntryId: '6DCThxvbPFKAo04SVRZtwY',
    thematicHighlightInfo: thematicHighlightInfoFixture,
  },
}
