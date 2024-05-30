import { Color } from 'features/home/types'
import { ContentTypes, VideoCarouselContentModel } from 'libs/contentful/types'

export const videoCarouselFixture: VideoCarouselContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: '3wfVCUGOPYBIKggC0nkJW1',
    type: 'Entry',
    createdAt: '2024-05-27T14:03:50.057Z',
    updatedAt: '2024-05-27T14:03:50.057Z',
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
        id: ContentTypes.VIDEO_CAROUSEL,
      },
    },
    locale: 'en-US',
  },
  fields: {
    title: 'Test carousel video',
    color: Color.Lilac,
    items: [
      {
        sys: {
          space: {
            sys: {
              type: 'Link',
              linkType: 'Space',
              id: '2bg01iqy0isv',
            },
          },
          id: '7ihPsS7RcX0WuLtCAJCI69',
          type: 'Entry',
          createdAt: '2024-05-27T14:03:44.773Z',
          updatedAt: '2024-05-27T14:03:44.773Z',
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
              id: ContentTypes.VIDEO_CAROUSEL_ITEM,
            },
          },
          locale: 'en-US',
        },
        fields: {
          title: 'Une vidéo',
          youtubeVideoId: 'NsFmOttIW9Y',
          offerId: '1116',
        },
      },
    ],
  },
}
