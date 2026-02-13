import React from 'react'
import { Animated, Share, View } from 'react-native'

import * as useGoBack from 'features/navigation/useGoBack'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { OfferHeader } from '../OfferHeader'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.spyOn(Share, 'share').mockImplementation(jest.fn())

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('features/navigation/SearchStackNavigator/getSearchHookConfig', () => ({
  getSearchHookConfig: jest.fn(() => ['SearchLanding', undefined]),
}))

jest.useFakeTimers()
const user = userEvent.setup()

describe('<OfferHeader /> (refacto wrapper)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render share and back buttons', () => {
    renderOfferHeader()

    expect(screen.getByTestId('animated-icon-back')).toBeOnTheScreen()
    expect(screen.getByLabelText('Partager')).toBeOnTheScreen()
  })

  it('should render children alongside buttons', () => {
    renderOfferHeader(<View testID="custom-child" />)

    expect(screen.getByTestId('custom-child')).toBeOnTheScreen()
    expect(screen.getByLabelText('Partager')).toBeOnTheScreen()
  })

  it('should call goBack when back button is pressed', async () => {
    renderOfferHeader()

    await user.press(screen.getByTestId('animated-icon-back'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when share button is pressed', async () => {
    renderOfferHeader()

    await user.press(screen.getByLabelText('Partager'))

    expect(analytics.logShare).toHaveBeenCalledWith({
      type: 'Offer',
      from: 'offer',
      offerId: offerResponseSnap.id,
    })
  })

  it('should use offer.name as header title', () => {
    renderOfferHeader()

    expect(screen.getByTestId('offerHeaderName')).toBeOnTheScreen()
  })
})

function renderOfferHeader(children?: React.ReactElement | null) {
  const animatedValue = new Animated.Value(0)
  render(
    <OfferHeader title="Ignored title" headerTransition={animatedValue} offer={offerResponseSnap}>
      {children}
    </OfferHeader>
  )
  return { animatedValue }
}
