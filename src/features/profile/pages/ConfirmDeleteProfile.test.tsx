import React from 'react'
import { useMutation } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate, goBack } from '__mocks__/@react-navigation/native'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, useMutationFactory } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ConfirmDeleteProfile } from './ConfirmDeleteProfile'

const mockedUseMutation = mocked(useMutation)

jest.mock('react-query')

const mockSignOut = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
  useLogoutRoutine: () => mockSignOut,
}))

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

describe('ConfirmDeleteProfile component', () => {
  it('should render confirm delete profile', () => {
    const renderAPI = render(reactQueryProviderHOC(<ConfirmDeleteProfile />))
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should redirect to DeleteProfileSuccess when clicking on "Supprimer mon compte" button', async () => {
    const useMutationCallbacks: { onSuccess: () => void } = {
      onSuccess: () => {},
    }
    // @ts-ignore ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    const renderAPI = render(reactQueryProviderHOC(<ConfirmDeleteProfile />))
    fireEvent.press(renderAPI.getByText('Supprimer mon compte'))
    useMutationCallbacks.onSuccess()

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('DeleteProfileSuccess')
      expect(mockSignOut).toBeCalled()
    })
  })

  it('should show error snackbar if suspend account request fails when clicking on "Supprimer mon compte" button', async () => {
    const useMutationCallbacks: { onError: (error: unknown) => void } = {
      onError: () => {},
    }
    // @ts-ignore ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    const renderAPI = render(reactQueryProviderHOC(<ConfirmDeleteProfile />))
    fireEvent.press(renderAPI.getByText('Supprimer mon compte'))
    useMutationCallbacks.onError({ error: undefined })

    await waitForExpect(() => {
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: 'Une erreur s’est produite pendant le chargement.',
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should redirect to LegalNotices when clicking on "Abandonner" button', () => {
    const renderAPI = render(reactQueryProviderHOC(<ConfirmDeleteProfile />))
    fireEvent.press(renderAPI.getByText('Abandonner'))
    expect(goBack).toBeCalledTimes(1)
  })
})
