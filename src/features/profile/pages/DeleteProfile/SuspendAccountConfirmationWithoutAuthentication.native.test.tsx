import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { SuspendAccountConfirmationWithoutAuthentication } from './SuspendAccountConfirmationWithoutAuthentication'

jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/firebase/analytics/analytics')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({ showErrorSnackBar: mockShowErrorSnackBar }),
}))

const mockApiSuspendAccount = jest.spyOn(API.api, 'postNativeV1AccountSuspend')

describe('SuspendAccountConfirmationNoToken', () => {
  it('should render correctly', () => {
    renderSuspendAccountConfirmationNoToken()

    expect(screen).toMatchSnapshot()
  })

  it('should send analytics event when clicking on "Contacter le support" button', () => {
    renderSuspendAccountConfirmationNoToken()

    whenPressingContactFraudTeamButton()

    expect(analytics.logContactFraudTeam).toHaveBeenCalledWith({
      from: 'suspendaccountconfirmation',
    })
  })

  it('should show error snackbar when an error occur during account suspension', async () => {
    renderSuspendAccountConfirmationNoToken()
    givenAccountSuspendWillFail()

    whenPressingSuspendAccountButton()

    await waitFor(() => {
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message:
          'Une erreur est survenue. Pour suspendre ton compte, contacte le support par e-mail.',
      })
    })
  })

  it('should navigate to SuspiciousLoginSuspendedAccount when account is suspended', async () => {
    renderSuspendAccountConfirmationNoToken()

    whenPressingSuspendAccountButton()

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SuspiciousLoginSuspendedAccount')
    })
  })

  function renderSuspendAccountConfirmationNoToken() {
    return render(reactQueryProviderHOC(<SuspendAccountConfirmationWithoutAuthentication />))
  }

  function whenPressingContactFraudTeamButton() {
    fireEvent.press(screen.getByText('Contacter le service fraude'))
  }

  function givenAccountSuspendWillFail() {
    mockApiSuspendAccount.mockRejectedValueOnce(new Error('An error occurred'))
  }

  function whenPressingSuspendAccountButton() {
    fireEvent.press(screen.getByText('Oui, suspendre mon compte'))
  }
})
