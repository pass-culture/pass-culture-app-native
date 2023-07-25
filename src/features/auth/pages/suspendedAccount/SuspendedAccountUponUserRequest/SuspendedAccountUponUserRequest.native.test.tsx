import React from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { navigate, replace } from '__mocks__/@react-navigation/native'
import { queriesToInvalidateOnUnsuspend } from 'features/auth/api/useAccountUnsuspend'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor, useMutationFactory } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { SuspendedAccountUponUserRequest } from './SuspendedAccountUponUserRequest'

jest.mock('features/auth/api/useAccountSuspensionDate', () => ({
  useAccountSuspensionDate: jest.fn(() => ({ data: { date: '2022-05-11T10:29:25.332786Z' } })),
}))
jest.mock('features/navigation/helpers')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

jest.mock('react-query')
const mockedUseMutation = jest.mocked(useMutation)

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

const useMutationCallbacks: { onError: (error: unknown) => void; onSuccess: () => void } = {
  onSuccess: () => {},
  onError: () => {},
}

describe('<SuspendedAccountUponUserRequest />', () => {
  const queryClient = useQueryClient()
  it('should match snapshot', () => {
    render(<SuspendedAccountUponUserRequest />)

    expect(screen).toMatchSnapshot()
  })

  it('should log analytics and redirect to reactivation screen on success', async () => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    render(<SuspendedAccountUponUserRequest />)

    fireEvent.press(screen.getByText('Réactiver mon compte'))

    expect(analytics.logAccountReactivation).toBeCalledWith('suspendedaccountuponuserrequest')

    useMutationCallbacks.onSuccess()
    await waitFor(() => {
      queriesToInvalidateOnUnsuspend.forEach((queryKey) =>
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith([queryKey])
      )
      expect(replace).toHaveBeenNthCalledWith(1, 'AccountReactivationSuccess')
    })
  })

  it('should log analytics and show error snackbar on error', async () => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    render(<SuspendedAccountUponUserRequest />)

    fireEvent.press(screen.getByText('Réactiver mon compte'))

    expect(analytics.logAccountReactivation).toBeCalledWith('suspendedaccountuponuserrequest')

    const response = {
      content: { message: 'Une erreur s’est produite pendant la réactivation.' },
      name: 'ApiError',
    }
    useMutationCallbacks.onError(response)
    await waitFor(() => {
      expect(mockShowErrorSnackBar).toHaveBeenNthCalledWith(1, {
        message: response.content.message,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should go to home page when clicking on go to home button', async () => {
    render(<SuspendedAccountUponUserRequest />)

    const homeButton = screen.getByText('Retourner à l’accueil')
    fireEvent.press(homeButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(
        1,
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })
})
