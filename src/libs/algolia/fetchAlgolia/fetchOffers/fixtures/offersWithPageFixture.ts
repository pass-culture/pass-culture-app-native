import { SubcategoryIdEnum } from 'api/gen'
import { OffersWithPage } from 'shared/offer/types'

export const OffersWithPageFixture: OffersWithPage = {
  offers: [
    {
      objectID: '102280',
      _geoloc: { lat: 48.94374, lng: 2.48171 },
      offer: {
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'La nuit des temps',
        prices: [2800],
        subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDNQ',
      },
    },
    {
      objectID: '102272',
      _geoloc: { lat: 48.91265, lng: 2.4513 },
      offer: {
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'I want something more',
        prices: [2300],
        subcategoryId: SubcategoryIdEnum.CONCERT,
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDKQ',
      },
    },
    {
      objectID: '102249',
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      offer: {
        dates: [1605643200],
        isDigital: false,
        isDuo: true,
        name: 'Un lit sous une rivière',
        prices: [3400],
        subcategoryId: SubcategoryIdEnum.CONCERT,
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDBA',
      },
    },
    {
      objectID: '102310',
      _geoloc: { lat: 4.90339, lng: -52.31663 },
      offer: {
        dates: [],
        isDigital: false,
        isDuo: false,
        name: 'I want something more',
        prices: [2800],
        subcategoryId: SubcategoryIdEnum.CONCERT,
        thumbUrl:
          'https://storage.gra.cloud.ovh.net/v1/AUTH_688df1e25bd84a48a3804e7fa8938085/storage-pc-dev/thumbs/mediations/CDZQ',
      },
    },
  ],
  nbOffers: 4,
  page: 1,
  nbPages: 2,
}
