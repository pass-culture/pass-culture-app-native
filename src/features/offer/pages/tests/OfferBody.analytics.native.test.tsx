import { AppState } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { analytics } from 'libs/analytics'
import { act, fireEvent } from 'tests/utils'

import { offerId, renderOfferBodyPage } from './renderOfferPageTestUtil'

describe('<OfferBody /> - Analytics', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  const trigger = (component: ReactTestInstance) => {
    act(() => {
      fireEvent.press(component)
      jest.advanceTimersByTime(300)
    })
  }

  it('should log ConsultAccessibilityModalities once when opening accessibility modalities', () => {
    const { getByText } = renderOfferBodyPage()

    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledWith(offerId)

    trigger(getByText('Accessibilité'))
    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening accessibility modalities', () => {
    const { getByText } = renderOfferBodyPage()

    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledWith(offerId)

    trigger(getByText('Modalités de retrait'))
    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })

  // TODO(Lucasbeneston): unskip this test. Make sure the feature works, find when the test was broken and fix it
  it.skip('should trigger logOfferSeenDuration', async () => {
    const offerPage = renderOfferBodyPage()
    expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()
    expect(AppState.addEventListener).toHaveBeenCalled()
    await act(async () => {
      await offerPage.unmount()
    })
    expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
    expect(AppState.removeEventListener).toHaveBeenCalled()
  })
})
