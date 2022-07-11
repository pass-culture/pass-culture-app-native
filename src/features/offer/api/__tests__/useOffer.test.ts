import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { offerResponseSnap } from '../snaps/offerResponseSnap'
import { useOffer } from '../useOffer'

describe('useOffer', () => {
  it('should call API otherwise', async () => {
    const { result } = renderHook(() => useOffer({ offerId: offerResponseSnap.id }), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerResponseSnap))
    })
  })
})
