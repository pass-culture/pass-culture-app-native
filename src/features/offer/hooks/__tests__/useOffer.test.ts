import { renderHook } from '@testing-library/react-hooks'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'

import { offerResponseSnap } from '../snaps/offerResponseSnap'
import { useOffer } from '../useOffer'

describe('useOffer', () => {
  it('should not call the API if offerId is null', () => {
    const { result } = renderHook(() => useOffer({ offerId: null }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    expect(result.current.isLoading).toBeFalsy()
  })
  it('should call API otherwise', async () => {
    const { result, waitFor } = renderHook(() => useOffer({ offerId: offerResponseSnap.id }), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => !result.current.isLoading)
    expect(result.current.data).toEqual(offerResponseSnap)
  })
})
