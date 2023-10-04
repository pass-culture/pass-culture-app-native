import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { eventMonitoring, MonitoringError } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor, act } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { SuspensionChoice } from './SuspensionChoice'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

describe('<SuspensionChoice/>', () => {
  it('should match snapshot', () => {
    renderSuspensionChoice()

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to suspension confirmation screen on suspension success', async () => {
    simulateSuspendForSuspiciousLoginSuccess()
    renderSuspensionChoice()

    const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')
    fireEvent.press(acceptSuspensionButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'SuspiciousLoginSuspendedAccount')
    })
  })

  it('should show snackbar on suspension error', async () => {
    simulateSuspendForSuspiciousLoginError()
    renderSuspensionChoice()

    const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')
    fireEvent.press(acceptSuspensionButton)

    await waitFor(() => {
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message:
          'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should log an error in Sentry on suspension error', async () => {
    const error = new MonitoringError('error')
    simulateSuspendForSuspiciousLoginError()
    renderSuspensionChoice()

    const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')
    fireEvent.press(acceptSuspensionButton)

    await act(async () => {})

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, undefined)
  })

  it('should open mail app when clicking on "Contacter le support" button', async () => {
    renderSuspensionChoice()

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    fireEvent.press(contactSupportButton)

    await waitFor(() => {
      expect(openUrl).toBeCalledWith(`mailto:service.fraude@test.passculture.app`, undefined, true)
    })
  })

  it('should log analytics when clicking on "Contacter le service fraude" button', () => {
    renderSuspensionChoice()

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    fireEvent.press(contactSupportButton)

    expect(analytics.logContactFraudTeam).toHaveBeenCalledWith({ from: 'suspensionchoice' })
  })

  it('should open CGU url when clicking on "conditions générales d’utilisation" button', () => {
    renderSuspensionChoice()

    const cguButton = screen.getByText('conditions générales d’utilisation')
    fireEvent.press(cguButton)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.CGU_LINK, undefined, true)
  })
})

function renderSuspensionChoice() {
  return render(<SuspensionChoice />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}

function simulateSuspendForSuspiciousLoginSuccess() {
  mockServer.postAPIV1('/native/v1/account/suspend_for_suspicious_login', {
    responseOptions: { statusCode: 200 },
  })
}

function simulateSuspendForSuspiciousLoginError() {
  mockServer.postAPIV1('/native/v1/account/suspend_for_suspicious_login', {
    responseOptions: { statusCode: 400 },
  })
}
