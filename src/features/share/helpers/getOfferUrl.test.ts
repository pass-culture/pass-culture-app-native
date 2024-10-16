import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { WEBAPP_V2_URL } from 'libs/environment'

import { getOfferUrl } from './getOfferUrl'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('getOfferUrl', () => {
  it('should return the url with the correct path and offer id and utm params', () => {
    const offerUrl = getOfferUrl(mockOffer.id, 'utm_medium')

    expect(offerUrl).toEqual(
      `${WEBAPP_V2_URL}/offre/146112?utm_gen=product&utm_campaign=share_offer&utm_medium=utm_medium`
    )
  })
})
