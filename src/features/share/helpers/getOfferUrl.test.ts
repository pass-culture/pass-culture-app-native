import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { WEBAPP_V2_URL } from 'libs/environment'

import { getOfferUrl } from './getOfferUrl'

describe('getOfferUrl', () => {
  it('should return the url with the correct path and offer id and utm params', () => {
    const offerUrl = getOfferUrl(mockOffer.id, 'utm_medium')

    expect(offerUrl).toEqual(
      `${WEBAPP_V2_URL}/offre/146112?utm_campaign=share_offer&utm_medium=utm_medium`
    )
  })
})
