import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { FetchError, MonitoringError } from 'libs/monitoring/errors'
import { eventMonitoring } from 'libs/monitoring/services'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { SuspensionChoice } from './SuspensionChoice'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('libs/firebase/analytics/analytics')

const useRemoteConfigSpy = jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SuspensionChoice/>', () => {
  it('should match snapshot', async () => {
    renderSuspensionChoice()

    await screen.findByText('Oui, suspendre mon compte')

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to suspension confirmation screen on suspension success', async () => {
    simulateSuspendForSuspiciousLoginSuccess()
    renderSuspensionChoice()

    const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')
    await user.press(acceptSuspensionButton)

    expect(navigate).toHaveBeenNthCalledWith(1, 'SuspiciousLoginSuspendedAccount')
  })

  it('should show snackbar on suspension error', async () => {
    simulateSuspendForSuspiciousLoginError()
    renderSuspensionChoice()

    const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')
    await user.press(acceptSuspensionButton)

    expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
    expect(
      screen.getByText(
        'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.'
      )
    ).toBeOnTheScreen()
  })

  describe('When shouldLogInfo remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: false,
        },
      })
    })

    it('should not capture an info in Sentry on suspension error', async () => {
      simulateSuspendForSuspiciousLoginError()
      renderSuspensionChoice()

      const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')

      await user.press(acceptSuspensionButton)

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
    })
  })

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: true,
        },
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(remoteConfigResponseFixture)
    })

    it('should capture an info in Sentry on suspension error', async () => {
      simulateSuspendForSuspiciousLoginError()
      renderSuspensionChoice()

      const acceptSuspensionButton = screen.getByText('Oui, suspendre mon compte')

      await user.press(acceptSuspensionButton)

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
    await user.press(acceptSuspensionButton)

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(error, undefined)
  })

  it('should open mail app when clicking on "Contacter le support" button', async () => {
    renderSuspensionChoice()

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    await user.press(contactSupportButton)

    expect(openUrl).toHaveBeenCalledWith(
      `mailto:service.fraude@test.passculture.app`,
      undefined,
      true
    )
  })

  it('should log analytics when clicking on "Contacter le service fraude" button', async () => {
    renderSuspensionChoice()

    const contactSupportButton = screen.getByText('Contacter le service fraude')
    await user.press(contactSupportButton)

    expect(analytics.logContactFraudTeam).toHaveBeenCalledWith({ from: 'suspensionchoice' })
  })

  it('should open CGU url when clicking on "conditions générales d’utilisation" button', async () => {
    renderSuspensionChoice()

    const cguButton = screen.getByText('conditions générales d’utilisation')
    await user.press(cguButton)

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
