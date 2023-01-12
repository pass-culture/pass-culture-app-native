import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { WEBAPP_V2_URL } from 'libs/environment'
import { renderHook } from 'tests/utils'

import { getOfferUrl } from './getOfferUrl'

describe('getOfferUrl', () => {
  it('should return the url with the correct path and offer id ', () => {
    const { result } = renderHook(() => getOfferUrl(mockOffer.id))

    expect(result.current).toEqual(`${WEBAPP_V2_URL}/offre/146112`)
  })
})
