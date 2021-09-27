import { renderHook } from '@testing-library/react-hooks'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { offerResponseSnap } from '../snaps/offerResponseSnap'
import { useOffer } from '../useOffer'

describe('useOffer', () => {
  it('should call API otherwise', async () => {
    const { result, waitFor } = renderHook(() => useOffer({ offerId: offerResponseSnap.id }), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => !result.current.isLoading)
    expect(JSON.stringify(result.current.data)).toEqual(JSON.stringify(offerResponseSnap))
  })
})
