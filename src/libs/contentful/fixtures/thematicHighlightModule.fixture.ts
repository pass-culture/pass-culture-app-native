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
    displayedTitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    displayedSubtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '2bg01iqy0isv',
          },
        },
        id: '6kYYW8Uwad2ZlLUmw1k4ax',
        type: 'Asset',
        createdAt: '2020-11-12T12:51:58.409Z',
        updatedAt: '2020-11-12T12:51:58.409Z',
        environment: {
          sys: {
            id: 'testing',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        revision: 1,
        locale: 'en-US',
      },
      fields: {
        title: 'Découvre Versailles',
        file: {
          url: '//images.ctfassets.net/2bg01iqy0isv/6kYYW8Uwad2ZlLUmw1k4ax/9e1261e7010f4419506dc821b2d0bea8/be697ba0-3439-42fa-8f54-b917e988db66.jpeg',
          details: {
            size: 321635,
            image: {
              width: 1600,
              height: 1200,
            },
          },
          fileName: 'be697ba0-3439-42fa-8f54-b917e988db66.jpeg',
          contentType: 'image/jpeg',
        },
      },
    },
    beginningDatetime: '2022-12-22T00:00+01:00',
    endingDatetime: '2023-01-15T00:00+01:00',
    thematicHomeEntryId: '6DCThxvbPFKAo04SVRZtwY',
  },
}
