import { Color } from 'features/home/types'
import { ContentTypes, HighlightOfferContentModel } from 'libs/contentful/types'

export const highlightOfferContentModelFixture: HighlightOfferContentModel = {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '2bg01iqy0isv',
      },
    },
    id: 'fH2FmoYeTzZPjhbz4ZHUW',
    type: 'Entry',
    createdAt: '2023-07-21T07:33:32.495Z',
    updatedAt: '2023-07-21T09:40:34.830Z',
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
        id: ContentTypes.HIGHLIGHT_OFFER,
      },
    },
    locale: 'en-US',
  },
  fields: {
    offerTitle: 'We love green',
    highlightTitle: 'L’offre du moment 💥',
    offerImage: {
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: '2bg01iqy0isv',
          },
        },
        id: 'E2HH4xFaGnqDsFffxBlvq',
        type: 'Asset',
        createdAt: '2023-06-29T14:14:44.939Z',
        updatedAt: '2023-06-29T14:14:44.939Z',
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
        title: 'couv WLG',
        description: 'La super vidéo de WLG',
        file: {
          url: '//images.ctfassets.net/2bg01iqy0isv/E2HH4xFaGnqDsFffxBlvq/b997f4612a51884c7a85143122a5913e/couv_YT.jpg',
          details: {
            size: 234816,
            image: {
              width: 1920,
              height: 1080,
            },
          },
          fileName: 'couv YT.jpg',
          contentType: 'image/jpeg',
        },
      },
    },
    color: Color.SkyBlue,
    offerId: '20859',
  },
}
