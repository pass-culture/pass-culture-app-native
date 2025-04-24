import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { reset } from '__mocks__/@react-navigation/native'
import { SetProfileBookingError } from 'features/identityCheck/pages/profile/SetProfileBookingError'
import { SubscriptionRootStackParamList } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SetProfileBookingError/>', () => {
  it('should render correctly', () => {
    renderSetProfileBookingError({ offerId: 123 })

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to offer when clicking on "Revenir vers l’offre"', async () => {
    renderSetProfileBookingError({ offerId: 123 })
    await user.press(screen.getByText('Revenir vers l’offre'))

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Offer', params: { id: 123 } }],
    })
  })

  it('should navigate to home when clicking on "Retourner à l’accueil"', async () => {
    renderSetProfileBookingError({ offerId: 123 })
    await user.press(screen.getByText('Retourner à l’accueil'))

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavConfig[0] }],
    })
  })

  it('should not display "Revenir vers l’offre" when no offerId', async () => {
    renderSetProfileBookingError({ offerId: undefined })

    const recaptchaWebviewModal = screen.queryByText('Revenir vers l’offre')

    expect(recaptchaWebviewModal).not.toBeOnTheScreen()
  })
})

const renderSetProfileBookingError = (navigationParams: { offerId?: number }) => {
  const navProps = { route: { params: navigationParams } } as StackScreenProps<
    SubscriptionRootStackParamList,
    'SetProfileBookingError'
  >
  return render(<SetProfileBookingError {...navProps} />)
}
