import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { userEvent, render, screen } from 'tests/utils'

import { SuspendAccountConfirmationWithoutAuthentication } from './SuspendAccountConfirmationWithoutAuthentication'

jest.mock('libs/jwt/jwt')
jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

const confirmationSuccessResponse = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('SuspendAccountConfirmationWithoutAuthentication', () => {
  it('should render correctly', () => {
    renderSuspendAccountConfirmationWithoutAuthentication()

    expect(screen).toMatchSnapshot()
  })

  it('should send analytics event when clicking on "Contacter le support" button', async () => {
    renderSuspendAccountConfirmationWithoutAuthentication()

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    await user.press(contactSupportButton)

    expect(analytics.logContactFraudTeam).toHaveBeenCalledWith({
      from: 'suspendaccountconfirmation',
    })
  })

  it('should navigate to SuspiciousLoginSuspendedAccount when account is suspended', async () => {
    simulateAccountSuspendForHackSuspicionSuccess()
    renderSuspendAccountConfirmationWithoutAuthentication()

    const suspendAccountButton = screen.getByText('Oui, suspendre mon compte')
    await user.press(suspendAccountButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SuspiciousLoginSuspendedAccount')
  })

  it('should show error snackbar when an error occur during account suspension', async () => {
    simulateAccountSuspendForHackSuspicionError()
    renderSuspendAccountConfirmationWithoutAuthentication()

    const suspendAccountButton = screen.getByText('Oui, suspendre mon compte')
    await user.press(suspendAccountButton)

    expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
    expect(
      screen.getByText(
        'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.'
      )
    ).toBeOnTheScreen()
  })

  function renderSuspendAccountConfirmationWithoutAuthentication() {
    return render(reactQueryProviderHOC(<SuspendAccountConfirmationWithoutAuthentication />))
  }

  function simulateAccountSuspendForHackSuspicionSuccess() {
    mockServer.postApi('/v1/account/suspend_for_hack_suspicion', {
      responseOptions: { statusCode: 200, data: confirmationSuccessResponse },
    })
  }

  function simulateAccountSuspendForHackSuspicionError() {
    mockServer.postApi('/v1/account/suspend_for_hack_suspicion', {
      responseOptions: { statusCode: 400, data: confirmationSuccessResponse },
    })
  }
})
