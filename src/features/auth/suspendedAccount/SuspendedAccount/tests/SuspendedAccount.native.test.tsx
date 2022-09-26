import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate, replace } from '__mocks__/@react-navigation/native'
import { queriesToInvalidateOnUnsuspend } from 'features/auth/suspendedAccount/SuspendedAccount/useAccountUnsuspend'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, useMutationFactory } from 'tests/utils'
import { SNACK_BAR_TIME_OUT } from 'ui/components/snackBar/SnackBarContext'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { SuspendedAccount } from '../SuspendedAccount'

jest.mock('features/auth/suspendedAccount/SuspendedAccount/useAccountSuspensionDate', () => ({
  useAccountSuspensionDate: jest.fn(() => ({ data: { date: '2022-05-11T10:29:25.332786Z' } })),
}))
jest.mock('features/navigation/helpers')

const mockSignOut = jest.fn()
jest.mock('features/auth/AuthContext', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

jest.mock('react-query')
const mockedUseMutation = mocked(useMutation)

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

describe('<SuspendedAccount />', () => {
  const queryClient = useQueryClient()
  it('should match snapshot', () => {
    expect(render(<SuspendedAccount />)).toMatchSnapshot()
  })

  it('should log analytics and redirect to reactivation screen on success', async () => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    const { getByTestId } = render(<SuspendedAccount />)

    await fireEvent.press(getByTestId('Réactiver mon compte'))
    expect(analytics.logAccountReactivation).toBeCalledWith('suspendedaccount')

    useMutationCallbacks.onSuccess()
    await waitForExpect(() => {
      queriesToInvalidateOnUnsuspend.forEach((queryKey) =>
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith(queryKey)
      )
      expect(replace).toHaveBeenCalledWith('AccountReactivationSuccess')
    })
  })

  it('should log analytics and show error snackbar on error', async () => {
    // @ts-expect-error ts(2345)
    mockedUseMutation.mockImplementationOnce(useMutationFactory(useMutationCallbacks))
    const { getByTestId } = render(<SuspendedAccount />)

    await fireEvent.press(getByTestId('Réactiver mon compte'))
    expect(analytics.logAccountReactivation).toBeCalledWith('suspendedaccount')

    const response = {
      content: { message: 'Une erreur s’est produite pendant la réactivation.' },
      name: 'ApiError',
    }
    useMutationCallbacks.onError(response)
    await waitForExpect(() => {
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
        message: response.content.message,
        timeout: SNACK_BAR_TIME_OUT,
      })
    })
  })

  it('should go to home page when clicking on go to home button', async () => {
    const { getByTestId } = render(<SuspendedAccount />)

    const homeButton = getByTestId('Retourner à l’accueil')
    fireEvent.press(homeButton)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })
})
