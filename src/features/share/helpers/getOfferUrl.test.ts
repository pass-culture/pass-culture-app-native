import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { WEBAPP_V2_URL } from 'libs/environment'

import { getOfferUrl } from './getOfferUrl'

describe('getOfferUrl', () => {
  it('should return the url with the correct path and offer id ', () => {
    const offerUrl = getOfferUrl(mockOffer.id)

    expect(offerUrl).toEqual(`${WEBAPP_V2_URL}/offre/146112`)
  })
})
