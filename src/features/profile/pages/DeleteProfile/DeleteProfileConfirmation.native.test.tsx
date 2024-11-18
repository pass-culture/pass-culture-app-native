import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import * as Auth from 'features/auth/context/AuthContext'
import * as OpenUrlAPI from 'features/navigation/helpers/openUrl'
import * as useGoBack from 'features/navigation/useGoBack'
import { nonBeneficiaryUser } from 'fixtures/user'
import { env } from 'libs/environment/fixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'

import { DeleteProfileConfirmation } from './DeleteProfileConfirmation'

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.spyOn(Auth, 'useAuthContext').mockReturnValue({
  isLoggedIn: true,
  user: nonBeneficiaryUser,
  isUserLoading: false,
  refetchUser: jest.fn(),
  setIsLoggedIn: jest.fn(),
}) as jest.Mock

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

const postAnonymizeAccountSpy = jest.spyOn(API.api, 'postNativeV1AccountAnonymize')

describe('DeleteProfileConfirmation', () => {
  it('should match snapshot', () => {
    renderDeleteProfileConfirmation()

    expect(screen).toMatchSnapshot()
  })

  it('should go back when clicking on go back button', () => {
    renderDeleteProfileConfirmation()

    const goBackButton = screen.getByTestId('Revenir en arrière')
    fireEvent.press(goBackButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should open FAQ link when clicking on "Consultez notre FAQ" button', () => {
    renderDeleteProfileConfirmation()

    const faqButton = screen.getByText('Consultez notre FAQ')
    fireEvent.press(faqButton)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_RIGHT_TO_ERASURE, undefined, true)
  })

  it('should navigate to home when pressing cancel button', () => {
    renderDeleteProfileConfirmation()

    fireEvent.press(screen.getByText('Annuler'))

    expect(navigate).toHaveBeenCalledWith('DeleteProfileReason', undefined)
  })

  it('should navigate to DeleteProfileSuccess when account is anonymized', async () => {
    renderDeleteProfileConfirmation()
    givenAnonymizeAccountSucceeds()

    whenAnonymizeAccount()

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('DeleteProfileSuccess')
    })
  })

  it('should delete the refreshToken, clean user profile and remove user ID from batch when account is anonymized', async () => {
    renderDeleteProfileConfirmation()
    givenAnonymizeAccountSucceeds()

    whenAnonymizeAccount()

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })
  })

  it('should show error snackbar when account anonymization fails', async () => {
    renderDeleteProfileConfirmation()
    givenAnonymizeAccountFails()

    whenAnonymizeAccount()

    await waitFor(() => {
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message:
          'Une erreur s’est produite lors de ta demande de suppression de compte. Réessaie plus tard.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  function renderDeleteProfileConfirmation() {
    return render(reactQueryProviderHOC(<DeleteProfileConfirmation />))
  }

  function whenAnonymizeAccount() {
    fireEvent.press(screen.getByText('Supprimer mon compte'))
  }

  function givenAnonymizeAccountSucceeds() {
    postAnonymizeAccountSpy.mockImplementationOnce(jest.fn())
  }

  function givenAnonymizeAccountFails() {
    postAnonymizeAccountSpy.mockRejectedValueOnce(new Error('Anonymization failed'))
  }
})
