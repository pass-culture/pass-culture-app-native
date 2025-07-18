import React from 'react'

import { reset, useRoute } from '__mocks__/@react-navigation/native'
import { SetProfileBookingError } from 'features/identityCheck/pages/profile/SetProfileBookingError'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

useRoute.mockReturnValue({
  params: { offerId: 123 },
})

describe('<SetProfileBookingError/>', () => {
  it('should render correctly', () => {
    renderSetProfileBookingError()

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to offer when clicking on "Revenir vers l’offre"', async () => {
    renderSetProfileBookingError()
    await user.press(screen.getByText('Revenir vers l’offre'))

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Offer', params: { id: 123 } }],
    })
  })

  it('should navigate to home when clicking on "Retourner à l’accueil"', async () => {
    renderSetProfileBookingError()
    await user.press(screen.getByText('Retourner à l’accueil'))

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavigationConfig[0] }],
    })
  })

  it('should not display "Revenir vers l’offre" when no offerId', async () => {
    useRoute.mockReturnValueOnce({
      params: { offerId: undefined },
    })

    renderSetProfileBookingError()

    const recaptchaWebviewModal = screen.queryByText('Revenir vers l’offre')

    expect(recaptchaWebviewModal).not.toBeOnTheScreen()
  })
})

const renderSetProfileBookingError = () => {
  return render(<SetProfileBookingError />)
}
