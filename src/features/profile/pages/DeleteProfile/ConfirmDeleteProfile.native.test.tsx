import React from 'react'
import { useMutation } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment/env'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor, useMutationFactory } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ConfirmDeleteProfile } from './ConfirmDeleteProfile'

const mockedUseMutation = jest.mocked(useMutation)

jest.mock('react-query')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: () => mockSignOut,
}))

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('ConfirmDeleteProfile component', () => {
  it('should render confirm delete profile', () => {
    renderConfirmDeleteProfile()

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to DeleteProfileSuccess when clicking on "Supprimer mon compte" button', () => {
    const useMutationCallbacks: { onSuccess: () => void } = {
      onSuccess: () => {},
    }
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    renderConfirmDeleteProfile()

    fireEvent.press(screen.getByText('Supprimer mon compte'))

    useMutationCallbacks.onSuccess()

    expect(navigate).toHaveBeenNthCalledWith(1, 'DeleteProfileSuccess')
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('should show error snackbar if suspend account request fails when clicking on "Supprimer mon compte" button', () => {
    const useMutationCallbacks: { onError: (error: unknown) => void } = {
      onError: () => {},
    }
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    renderConfirmDeleteProfile()

    fireEvent.press(screen.getByText('Supprimer mon compte'))

    useMutationCallbacks.onError({ error: undefined })

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
      message: 'Une erreur s’est produite pendant le chargement.',
      timeout: SNACK_BAR_TIME_OUT,
    })
  })

  it('should log analytics and redirect to FAQ when clicking on FAQ link', async () => {
    renderConfirmDeleteProfile()

    fireEvent.press(screen.getByText('Consulter l’article d’aide'))

    await waitFor(() => {
      expect(analytics.logConsultArticleAccountDeletion).toHaveBeenCalledTimes(1)
      expect(openUrl).toBeCalledWith(env.FAQ_LINK_DELETE_ACCOUNT, undefined, true)
    })
  })

  it('should go back when clicking on go back button', () => {
    renderConfirmDeleteProfile()

    fireEvent.press(screen.getByTestId('Revenir en arrière'))

    expect(mockGoBack).toBeCalledTimes(1)
  })

  it('should open CGU when clicking on "conditions générales d’utilisation"', () => {
    renderConfirmDeleteProfile()

    fireEvent.press(screen.getByLabelText('conditions générales d’utilisation'))

    expect(openUrl).toHaveBeenNthCalledWith(1, env.CGU_LINK, undefined, true)
  })
})

function renderConfirmDeleteProfile() {
  return render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<ConfirmDeleteProfile />)
  )
}
