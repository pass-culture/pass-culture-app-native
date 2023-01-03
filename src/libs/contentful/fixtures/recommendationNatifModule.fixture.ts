import { ContentTypes, RecommendationContentModel } from 'libs/contentful/types'

export const recommendationNatifModuleFixture: RecommendationContentModel = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '3sAqNrRMXUOES7tFyRFFO8',
    type: 'Entry',
    createdAt: '2022-07-13T12:28:35.922Z',
    updatedAt: '2022-12-06T09:31:04.217Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 3,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'recommendation' } },
    locale: 'en-US',
  },
  fields: {
    title: 'Nos recos',
    displayParameters: {
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
        id: '5zr0sGoxz6mSgkPDgk0pY9',
        type: 'Entry',
        createdAt: '2022-07-13T12:28:32.262Z',
        updatedAt: '2022-12-06T09:31:38.064Z',
        environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
        revision: 3,
        contentType: {
          sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.DISPLAY_PARAMETERS },
        },
        locale: 'en-US',
      },
      fields: { title: 'Nos recos', layout: 'two-items', minOffers: 1 },
    },
  },
}
