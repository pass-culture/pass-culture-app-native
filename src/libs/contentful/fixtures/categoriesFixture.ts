import { Categories, ContentTypes } from 'libs/contentful/types'

export const categoriesFixture: Categories = {
  sys: {
    space: { sys: { type: 'Link', linkType: 'Space', id: '2bg01iqy0isv' } },
    id: '14xVRrRqjIatpIBRP1Z6Jh',
    type: 'Entry',
    createdAt: '2020-11-12T11:10:41.542Z',
    updatedAt: '2022-06-03T14:11:30.186Z',
    environment: { sys: { id: 'testing', type: 'Link', linkType: 'Environment' } },
    revision: 3,
    contentType: {
      sys: { type: 'Link', linkType: 'ContentType', id: ContentTypes.CATEGORIES },
    },
    locale: 'en-US',
  },
  fields: {
    categories: ['Cartes jeunes', 'Spectacles'],
  },
}
