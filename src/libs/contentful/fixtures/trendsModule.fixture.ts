import { ContentTypes, TrendsContentModel } from 'libs/contentful/types'

const image = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '635psakQQwLtNuOFcf1jx2',
    type: 'Asset',
    createdAt: '2024-06-06T14:55:54.635Z',
    updatedAt: '2024-06-06T14:55:54.635Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    locale: 'en-US',
  },
  fields: {
    title: 'Icône Recos',
    description: '',
    file: {
      url: '//images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
      details: { size: 13129, image: { width: 113, height: 112 } },
      fileName: 'recos.png',
      contentType: 'image/png',
    },
  },
}

export const trendsModuleFixture: TrendsContentModel = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: 'g6VpeYbOosfALeqR55Ah6',
    type: 'Entry',
    createdAt: '2024-06-06T15:11:43.590Z',
    updatedAt: '2024-06-06T15:11:43.590Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 1,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.TRENDS } },
    locale: 'en-US',
  },
  fields: {
    items: [
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: '6dn0unOv4tRBNfOebVHOOy',
          type: 'Entry',
          createdAt: '2024-04-08T14:45:00.631Z',
          updatedAt: '2024-04-08T14:45:00.631Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          contentType: {
            sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.VENUE_MAP_BLOCK },
          },
          locale: 'en-US',
        },
        fields: {
          title: 'Accès carte des lieux',
          homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
        },
      },
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: '16ZgVwnOXvVc0N8ko9Kius',
          type: 'Entry',
          createdAt: '2024-06-06T14:59:25.688Z',
          updatedAt: '2024-06-06T14:59:25.688Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          contentType: {
            sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.TREND_BLOCK },
          },
          locale: 'en-US',
        },
        fields: { title: 'Tendance 1', image, homeEntryId: '7qcfqY5zFesLVO5fMb4cqm' },
      },
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: '16ZgVwnOXvVc0N8ko9Kius',
          type: 'Entry',
          createdAt: '2024-06-06T14:59:25.688Z',
          updatedAt: '2024-06-06T14:59:25.688Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          contentType: {
            sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.TREND_BLOCK },
          },
          locale: 'en-US',
        },
        fields: { title: 'Tendance 2', image, homeEntryId: '7qcfqY5zFesLVO5fMb4cqm' },
      },
      {
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
          id: '16ZgVwnOXvVc0N8ko9Kius',
          type: 'Entry',
          createdAt: '2024-06-06T14:59:25.688Z',
          updatedAt: '2024-06-06T14:59:25.688Z',
          environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
          contentType: {
            sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.TREND_BLOCK },
          },
          locale: 'en-US',
        },
        fields: { title: 'Tendance 3', image, homeEntryId: '7qcfqY5zFesLVO5fMb4cqm' },
      },
    ],
  },
}
