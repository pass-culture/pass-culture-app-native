import { act, fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Animated } from 'react-native'
import waitForExpect from 'wait-for-expect'

import { goBack } from '__mocks__/@react-navigation/native'
import { useAuthContext } from 'features/auth/AuthContext'
import { analytics } from 'libs/analytics'
import { flushAllPromises } from 'tests/utils'

import { OfferHeader } from '../OfferHeader'

jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

describe('<OfferHeader />', () => {
  it('should render correctly', async () => {
    const { toJSON } = await renderOfferHeader(true)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should render the correct icons - loggedIn', async () => {
    const offerHeader = await renderOfferHeader(true)
    expect(offerHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-share')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-favorite')).toBeTruthy()
  })

  it('should render the correct icons - not loggedIn', async () => {
    const offerHeader = await renderOfferHeader(false)
    expect(offerHeader.queryByTestId('icon-back')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-share')).toBeTruthy()
    expect(offerHeader.queryByTestId('icon-favorite')).toBeNull()
  })

  it('should goBack when we press on the back buttton', async () => {
    const { getByTestId } = await renderOfferHeader(true)
    fireEvent.press(getByTestId('icon-back'))
    expect(goBack).toHaveBeenCalledTimes(1)
  })
  it('should render a placeholder only if the user is connected', async () => {
    const connectedHeader = await renderOfferHeader(true)
    expect(connectedHeader.queryByTestId('headerIconPlaceholder')).toBeTruthy()
    const disconnectedHeader = await renderOfferHeader(false)
    expect(disconnectedHeader.queryByTestId('headerIconPlaceholder')).toBeFalsy()
  })
  it('should fully display the title at the end of the animation', async () => {
    const { animatedValue, getByTestId } = await renderOfferHeader(true)
    expect(getByTestId('offerHeaderName').props.style.opacity).toBe(0)
    Animated.timing(animatedValue, { duration: 100, toValue: 1, useNativeDriver: false }).start()
    await waitForExpect(() => expect(getByTestId('offerHeaderName').props.style.opacity).toBe(1))
  })

  describe('<OfferHeader /> - Analytics', () => {
    it('should log ShareOffer once when clicking on the Share button', async () => {
      const { getByTestId } = await renderOfferHeader(true)

      fireEvent.press(getByTestId('icon-share'))
      expect(analytics.logShareOffer).toHaveBeenCalledTimes(1)
      expect(analytics.logShareOffer).toHaveBeenCalledWith(offerId)

      fireEvent.press(getByTestId('icon-share'))
      fireEvent.press(getByTestId('icon-share'))
      expect(analytics.logShareOffer).toHaveBeenCalledTimes(1)
    })
  })
})

const offerId = 30
async function renderOfferHeader(isLoggedIn: boolean) {
  mockUseAuthContext.mockImplementationOnce(() => ({ isLoggedIn }))
  const animatedValue = new Animated.Value(0)
  const wrapper = render(
    <OfferHeader title="Some very nice offer" headerTransition={animatedValue} offerId={offerId} />
  )
  await act(async () => {
    await flushAllPromises()
  })
  return { ...wrapper, animatedValue }
}
