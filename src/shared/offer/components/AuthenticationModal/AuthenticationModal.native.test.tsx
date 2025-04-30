import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { userEvent, render, screen } from 'tests/utils'

import { AuthenticationModal } from './AuthenticationModal'

const OFFER_ID = 123
const hideModal = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<AuthenticationModal />', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', () => {
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
    await user.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      offerId: OFFER_ID,
      from: StepperOrigin.BOOKING,
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
    await user.press(signupButton)

    expect(analytics.logSignUpFromAuthenticationModal).toHaveBeenNthCalledWith(1, OFFER_ID)
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, {
      from: 'offer_booking',
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
    await user.press(signinButton)

    expect(analytics.logSignInFromAuthenticationModal).toHaveBeenNthCalledWith(1, OFFER_ID)
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
    await user.press(signinButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
      offerId: OFFER_ID,
      from: StepperOrigin.BOOKING,
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
    await user.press(signinButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
      offerId: OFFER_ID,
      from: StepperOrigin.FAVORITE,
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
    await user.press(closeButton)

    expect(analytics.logQuitAuthenticationModal).toHaveBeenNthCalledWith(1, OFFER_ID)
  })
})
