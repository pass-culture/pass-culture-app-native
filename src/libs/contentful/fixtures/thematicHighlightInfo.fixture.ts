import { ContentTypes, ThematicHighlightInfo } from 'libs/contentful/types'

export const thematicHighlightInfoFixture: ThematicHighlightInfo = {
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
        id: ContentTypes.THEMATIC_HIGHLIGHT_INFO,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Temps fort',
    displayedTitle: 'Temps très fort',
    displayedSubtitle: 'Avec son sous-titre',
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
    introductionTitle: 'un super titre pour une super introduction',
    introductionParagraph:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s...Ipsum has been the industry’s standard dummy text ever since the 1500s...',
  },
}
