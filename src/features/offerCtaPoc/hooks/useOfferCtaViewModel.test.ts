import { PropsWithChildren } from 'react'

import { useOfferCtaViewModel } from 'features/offerCtaPoc/hooks/useOfferCtaViewModel'
import { offerCtaActions } from 'features/offerCtaPoc/store/offerCtaStore'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

// KILL CRITERION: this hook must be testable with NO business mocks. The only
// wrapper here is the React Query provider (a real boundary, not a mock).
// `jest.mock` count for business logic = 0.

const wrapper = ({ children }: PropsWithChildren) => reactQueryProviderHOC(children)

describe('useOfferCtaViewModel', () => {
  beforeEach(() => {
    act(() => {
      offerCtaActions.closeBookingModal()
    })
  })

  it('exposes the resolved decision for a bookable offer', async () => {
    const { result } = renderHook(() => useOfferCtaViewModel('BOOKABLE'), { wrapper })

    await waitFor(() => {
      expect(result.current.decision).toEqual({
        type: 'BOOK_OFFER',
        wording: 'Réserver',
        isDisabled: false,
      })
    })
  })

  it('disables the CTA when credit is insufficient', async () => {
    const { result } = renderHook(() => useOfferCtaViewModel('INSUFFICIENT_CREDIT'), { wrapper })

    await waitFor(() => {
      expect(result.current.decision?.type).toBe('INSUFFICIENT_CREDIT')
    })

    expect(result.current.decision?.isDisabled).toBe(true)
  })

  it('opens and closes the booking modal via the local store', async () => {
    const { result } = renderHook(() => useOfferCtaViewModel('BOOKABLE'), { wrapper })

    await waitFor(() => {
      expect(result.current.decision).toBeDefined()
    })

    expect(result.current.isBookingModalVisible).toBe(false)

    act(() => {
      result.current.onPress()
    })

    expect(result.current.isBookingModalVisible).toBe(true)

    act(() => {
      result.current.onCloseBookingModal()
    })

    expect(result.current.isBookingModalVisible).toBe(false)
  })
})
