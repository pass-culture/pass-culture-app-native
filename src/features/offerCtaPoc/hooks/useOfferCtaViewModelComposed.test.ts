import { PropsWithChildren } from 'react'

import { useOfferCtaViewModelComposed } from 'features/offerCtaPoc/hooks/useOfferCtaViewModelComposed'
import { offerCtaActions } from 'features/offerCtaPoc/store/offerCtaStore'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

// Same kill criterion as variant A: testable with NO business mocks. The
// composed hook behaves identically — proving C buys B's granularity without
// losing A's testability.

const wrapper = ({ children }: PropsWithChildren) => reactQueryProviderHOC(children)

describe('useOfferCtaViewModelComposed (variant C)', () => {
  beforeEach(() => {
    act(() => {
      offerCtaActions.closeBookingModal()
    })
  })

  it('exposes the resolved decision for a bookable offer', async () => {
    const { result } = renderHook(() => useOfferCtaViewModelComposed('BOOKABLE'), { wrapper })

    await waitFor(() => {
      expect(result.current.decision).toEqual({
        type: 'BOOK_OFFER',
        wording: 'Réserver',
        isDisabled: false,
      })
    })
  })

  it('opens and closes the booking modal via the composed use-case hooks', async () => {
    const { result } = renderHook(() => useOfferCtaViewModelComposed('BOOKABLE'), { wrapper })

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
