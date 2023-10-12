import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { From } from 'shared/offer/enums'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

import { AuthenticationModal } from './AuthenticationModal'

const OFFER_ID = 123
const hideModal = jest.fn()

describe('<AuthenticationModal />', () => {
  it('should match previous snapshot', () => {
    const modal = render(
      <AuthenticationModal visible offerId={OFFER_ID} hideModal={hideModal} from={From.BOOKING} />
    )
    expect(modal).toMatchSnapshot()
  })

  it('should navigate to signup page when clicking on "Créer un compte" button', async () => {
    render(
      <AuthenticationModal visible offerId={OFFER_ID} hideModal={hideModal} from={From.BOOKING} />
    )

    const signupButton = screen.getByLabelText('Créer un compte')

    fireEvent.press(signupButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SignupForm', {
        preventCancellation: true,
        offerId: OFFER_ID,
        from: From.BOOKING,
      })
    })
  })

  it('should log analytics when clicking on "Créer un compte" button', async () => {
    render(
      <AuthenticationModal visible offerId={OFFER_ID} hideModal={hideModal} from={From.BOOKING} />
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
      <AuthenticationModal visible offerId={OFFER_ID} hideModal={hideModal} from={From.BOOKING} />
    )

    const signinButton = screen.getByText('Se connecter')

    fireEvent.press(signinButton)

    await waitFor(() => {
      expect(analytics.logSignInFromAuthenticationModal).toHaveBeenNthCalledWith(1, OFFER_ID)
    })
  })

  it('should go to Login from booking with offerId', async () => {
    render(
      <AuthenticationModal visible offerId={OFFER_ID} hideModal={hideModal} from={From.BOOKING} />
    )

    const signinButton = screen.getByText('Se connecter')

    fireEvent.press(signinButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
        preventCancellation: true,
        offerId: OFFER_ID,
        from: From.BOOKING,
      })
    })
  })

  it('should go to Login from favorite with offerId', async () => {
    render(
      <AuthenticationModal visible offerId={OFFER_ID} hideModal={hideModal} from={From.FAVORITE} />
    )

    const signinButton = screen.getByText('Se connecter')

    fireEvent.press(signinButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'Login', {
        preventCancellation: true,
        offerId: OFFER_ID,
        from: From.FAVORITE,
      })
    })
  })

  it('should log analytics when clicking on close button with label "Fermer la modale', async () => {
    render(
      <AuthenticationModal visible offerId={OFFER_ID} hideModal={hideModal} from={From.BOOKING} />
    )

    const closeButton = screen.getByLabelText('Fermer la modale')

    fireEvent.press(closeButton)

    await waitFor(() => {
      expect(analytics.logQuitAuthenticationModal).toHaveBeenNthCalledWith(1, OFFER_ID)
    })
  })
})
