import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { eventMonitoring, MonitoringError } from 'libs/monitoring'
import { FetchError } from 'libs/monitoring/errors'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { SuspensionChoice } from './SuspensionChoice'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

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

  describe('When shouldLogInfo remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: false,
      })
    })

    it('should not capture an info in Sentry on suspension error', async () => {
      simulateSuspendForSuspiciousLoginError()
      renderSuspensionChoice()

      const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')

      await act(async () => fireEvent.press(acceptSuspensionButton))

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
    })
  })

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigContextSpy.mockReturnValue({
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      })
    })

    afterAll(() => {
      useRemoteConfigContextSpy.mockReturnValue(DEFAULT_REMOTE_CONFIG)
    })

    it('should capture an info in Sentry on suspension error', async () => {
      simulateSuspendForSuspiciousLoginError()
      renderSuspensionChoice()

      const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')

      await act(async () => fireEvent.press(acceptSuspensionButton))

      expect(eventMonitoring.captureException).toHaveBeenNthCalledWith(
        1,
        'Can’t suspend account for suspicious login ; reason: "invalid json response body at https://localhost/native/v1/account/suspend_for_suspicious_login reason: Unexpected end of JSON input"',
        {
          level: 'info',
          extra: {
            error: new FetchError(
              'invalid json response body at https://localhost/native/v1/account/suspend_for_suspicious_login reason: Unexpected end of JSON input'
            ),
          },
        }
      )
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
      expect(openUrl).toHaveBeenCalledWith(
        `mailto:service.fraude@test.passculture.app`,
        undefined,
        true
      )
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
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}

function simulateSuspendForSuspiciousLoginSuccess() {
  mockServer.postApi('/v1/account/suspend_for_suspicious_login', {})
}

function simulateSuspendForSuspiciousLoginError() {
  mockServer.postApi('/v1/account/suspend_for_suspicious_login', {
    responseOptions: { statusCode: 400 },
  })
}
