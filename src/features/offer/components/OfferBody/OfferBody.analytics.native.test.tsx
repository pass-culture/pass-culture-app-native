import { ReactTestInstance } from 'react-test-renderer'
import waitForExpect from 'wait-for-expect'

import { offerId, renderOfferBodyPage } from 'features/offer/helpers/renderOfferPageTestUtil'
import { analytics } from 'libs/firebase/analytics'
import { act, fireEvent } from 'tests/utils'

describe('<OfferBody /> - Analytics', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  const trigger = (component: ReactTestInstance) => {
    act(() => {
      fireEvent.press(component)
      jest.advanceTimersByTime(300)
    })
  }

  it('should trigger logOfferSeenDuration after unmount', async () => {
    const offerPage = await renderOfferBodyPage()
    await waitForExpect(async () => {
      expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()
    })

    await act(async () => {
      await offerPage.unmount()
    })
    await waitForExpect(() => {
      expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
    })
  })

  it('should log ConsultAccessibilityModalities once when opening accessibility modalities', async () => {
    const { getByText } = await renderOfferBodyPage()

    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultAccessibility).toHaveBeenCalledWith({ offerId })

    trigger(getByText('Accessibilité'))
    trigger(getByText('Accessibilité'))
    expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
  })

  it('should log ConsultWithdrawalModalities once when opening withdrawal modalities', async () => {
    const { getByText } = await renderOfferBodyPage()

    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledWith({ offerId })

    trigger(getByText('Modalités de retrait'))
    trigger(getByText('Modalités de retrait'))
    expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
  })
})
