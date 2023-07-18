import { Color } from 'features/home/types'
import { ContentTypes, VideoContentModel } from 'libs/contentful/types'

export const videoContentModelFixture: VideoContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '4ZzxHKDN7BvBAxVR6hFbU6',
    type: 'Entry',
    createdAt: '2023-05-23T08:22:36.188Z',
    updatedAt: '2023-05-23T13:05:38.122Z',
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
        id: ContentTypes.VIDEO,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Vidéo Youtube Lujipeka',
    displayedTitle: 'Découvre Lujipeka',
    videoTitle: 'Lujipeka répond à vos questions\u00a0!',
    videoThumbnail: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '2bg01iqy0isv',
          },
        },
        id: '326jseCDgaDNyOu4XAsBec',
        type: 'Asset',
        createdAt: '2023-05-23T08:20:49.570Z',
        updatedAt: '2023-05-23T08:20:49.570Z',
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
        title: 'Lujipeka',
        description: '',
        file: {
          url: '//images.ctfassets.net/2bg01iqy0isv/326jseCDgaDNyOu4XAsBec/f338921eaae630381841d0eeeb84ce60/lujipeka',
          details: {
            size: 514294,
            image: {
              width: 700,
              height: 420,
            },
          },
          fileName: 'lujipeka',
          contentType: 'image/png',
        },
      },
    },
    durationInMinutes: 2,
    youtubeVideoId: 'qE7xwEZnFP0',
    algoliaParameters: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '2bg01iqy0isv',
          },
        },
        id: 'GHTIOHS3FOnhE4AWnuPsj',
        type: 'Entry',
        createdAt: '2023-01-26T10:10:31.139Z',
        updatedAt: '2023-02-07T16:03:49.325Z',
        environment: {
          sys: {
            id: 'testing',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        revision: 6,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: ContentTypes.ALGOLIA_PARAMETERS,
          },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'test music type',
        isGeolocated: false,
        hitsPerPage: 1,
      },
    },
    color: Color.Aquamarine,
    videoTag: 'FAQ',
    offerTitle: 'Pour aller plus loin…',
    videoDescription:
      'Lujipeka répond à vos questions sur sa tournée, sa musique, ses inspirations et pleins d’autres questions&nbsp;!',
    videoPublicationDate: '2023-06-16',
    offerIds: ['12345', '67890'],
  },
}
