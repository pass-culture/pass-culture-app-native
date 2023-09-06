import { SubcategoryIdEnum } from 'api/gen'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { getSimilarOrRecoOffersInOrder } from 'shared/offer/getSimilarOrRecoOffersInOrder'

describe('getSimilarOffersInOrder', () => {
  const ids = ['102310', '102249', '102272', '102280']
  const offers = mockedAlgoliaResponse.hits

  it('should return offers in ids array order', () => {
    const similarOffersInOrder = getSimilarOrRecoOffersInOrder(ids, offers)
    expect(similarOffersInOrder).toEqual([
      {
        offer: {
          dates: [],
          isDigital: false,
          isDuo: false,
          name: 'I want something more',
          prices: [28.0],
          subcategoryId: SubcategoryIdEnum.CONCERT,
          thumbUrl:
            'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDZQ',
        },
        _geoloc: { lat: 4.90339, lng: -52.31663 },
        objectID: '102310',
        venue: {
          id: 4,
          name: 'Lieu 4',
          publicName: 'Lieu 4',
          address: '4 rue de la paix',
          postalCode: '75000',
          city: 'Paris',
        },
      },
      {
        offer: {
          dates: [1605643200.0],
          isDigital: false,
          isDuo: true,
          name: 'Un lit sous une rivière',
          prices: [34.0],
          subcategoryId: SubcategoryIdEnum.CONCERT,
          thumbUrl:
            'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDBA',
        },
        _geoloc: { lat: 4.90339, lng: -52.31663 },
        objectID: '102249',
        venue: {
          id: 3,
          name: 'Lieu 3',
          publicName: 'Lieu 3',
          address: '3 rue de la paix',
          postalCode: '75000',
          city: 'Paris',
        },
      },
      {
        offer: {
          dates: [],
          isDigital: false,
          isDuo: false,
          name: 'I want something more',
          prices: [23.0],
          subcategoryId: SubcategoryIdEnum.CONCERT,
          thumbUrl:
            'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDKQ',
        },
        _geoloc: { lat: 48.91265, lng: 2.4513 },
        objectID: '102272',
        venue: {
          id: 2,
          name: 'Lieu 2',
          publicName: 'Lieu 2',
          address: '2 rue de la paix',
          postalCode: '75000',
          city: 'Paris',
        },
      },
      {
        offer: {
          dates: [],
          isDigital: false,
          isDuo: false,
          name: 'La nuit des temps',
          prices: [28.0],
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          thumbUrl:
            'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
        },
        _geoloc: { lat: 48.94374, lng: 2.48171 },
        objectID: '102280',
        venue: {
          id: 1,
          name: 'Lieu 1',
          publicName: 'Lieu 1',
          address: '1 rue de la paix',
          postalCode: '75000',
          city: 'Paris',
        },
      },
    ])
  })

  it('should not return offers in offers array order', () => {
    const similarOffersInOrder = getSimilarOrRecoOffersInOrder(ids, offers)
    expect(similarOffersInOrder).not.toEqual(offers)
  })
})
