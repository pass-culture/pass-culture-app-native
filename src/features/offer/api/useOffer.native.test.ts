import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useOffer } from './useOffer'

describe('useOffer', () => {
  it('should call API otherwise', async () => {
    const { result } = renderHook(() => useOffer({ offerId: offerResponseSnap.id }), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerResponseSnap))
  })
})
