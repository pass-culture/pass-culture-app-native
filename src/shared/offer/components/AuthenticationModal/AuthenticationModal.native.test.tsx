import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

import { AuthenticationModal } from './AuthenticationModal'

const OFFER_ID = 123
const hideModal = jest.fn()

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<AuthenticationModal />', () => {
  it('should match previous snapshot', () => {
    render(
      <AuthenticationModal
        visible
        offerId={OFFER_ID}
        hideModal={hideModal}
        from={StepperOrigin.BOOKING}
      />
    )

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to signup page when clicking on "Créer un compte" button', async () => {
    render(
      <AuthenticationModal
        visible
        offerId={OFFER_ID}
        hideModal={hideModal}
        from={StepperOrigin.BOOKING}
      />
    )

    const signupButton = screen.getByLabelText('Créer un compte')

    fireEvent.press(signupButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SignupForm', {
        offerId: OFFER_ID,
        from: StepperOrigin.BOOKING,
      })
    })
  })

  it('should log analytics when clicking on "Créer un compte" button', async () => {
    render(
      <AuthenticationModal
        visible
        offerId={OFFER_ID}
        hideModal={hideModal}
        from={StepperOrigin.BOOKING}
      />
    )

    const signupButton = screen.getByLabelText('Créer un compte')

    fireEvent.press(signupButton)

    await waitFor(() => {
      expect(analytics.logSignUpFromAuthenticationModal).toHaveBeenNthCalledWith(1, OFFER_ID)
      expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
        from: 'offer_booking',
      })
    })
  })

  it('should log analytics when clicking on "Se connecter" button', async () => {
    render(
      <AuthenticationModal
        visible
        offerId={OFFER_ID}
        hideModal={hideModal}
        from={StepperOrigin.BOOKING}
      />
    )

    const signinButton = screen.getByText('Se connecter')

    fireEvent.press(signinButton)

    await waitFor(() => {
      expect(analytics.logSignInFromAuthenticationModal).toHaveBeenNthCalledWith(1, OFFER_ID)
    })
  })

  it('should go to Login from booking with offerId', async () => {
    render(
      <AuthenticationModal
        visible
        offerId={OFFER_ID}
        hideModal={hideModal}
        from={StepperOrigin.BOOKING}
      />
    )

    const signinButton = screen.getByText('Se connecter')

    fireEvent.press(signinButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
        offerId: OFFER_ID,
        from: StepperOrigin.BOOKING,
      })
    })
  })

  it('should go to Login from favorite with offerId', async () => {
    render(
      <AuthenticationModal
        visible
        offerId={OFFER_ID}
        hideModal={hideModal}
        from={StepperOrigin.FAVORITE}
      />
    )

    const signinButton = screen.getByText('Se connecter')

    fireEvent.press(signinButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
        offerId: OFFER_ID,
        from: StepperOrigin.FAVORITE,
      })
    })
  })

  it('should log analytics when clicking on close button with label "Fermer la modale', async () => {
    render(
      <AuthenticationModal
        visible
        offerId={OFFER_ID}
        hideModal={hideModal}
        from={StepperOrigin.BOOKING}
      />
    )

    const closeButton = screen.getByLabelText('Fermer la modale')

    fireEvent.press(closeButton)

    await waitFor(() => {
      expect(analytics.logQuitAuthenticationModal).toHaveBeenNthCalledWith(1, OFFER_ID)
    })
  })
})
