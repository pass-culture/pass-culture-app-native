import { ContentTypes, ExclusivityContentModel } from 'libs/contentful/types'

export const exclusivityNatifModuleFixture: ExclusivityContentModel = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: 'AEYnm9QjIo2rZKoCfSvMD',
    type: 'Entry',
    createdAt: '2022-11-21T09:43:22.352Z',
    updatedAt: '2022-11-21T09:43:22.352Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 1,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.EXCLUSIVITY } },
    locale: 'en-US',
  },
  fields: {
    title: 'WE FRAC CAEN',
    alt: 'Week-end FRAC',
    image: {
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
        id: '1uTePwMo6qxJo7bMM7VLeX',
        type: 'Asset',
        createdAt: '2022-11-10T17:15:29.312Z',
        updatedAt: '2022-11-10T17:19:54.202Z',
        environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
        revision: 3,
        locale: 'en-US',
      },
      fields: {
        title: 'wefrac',
        description: '',
        file: {
          url: '//images.ctfassets.net/2bg01iqy0isv/1uTePwMo6qxJo7bMM7VLeX/fdea7eb6fd7ab2003a5f1eeaba2565e9/17-insta-1080x1350_560x800.jpg',
          details: { size: 100095, image: { width: 560, height: 800 } },
          fileName: '17-insta-1080x1350_560x800.jpg',
          contentType: 'image/jpeg',
        },
      },
    },
    offerId: '123456789',
  },
}
