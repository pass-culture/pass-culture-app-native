import React from 'react'

import { reset, navigate } from '__mocks__/@react-navigation/native'
import { ApiError } from 'api/ApiError'
import * as resetStores from 'features/identityCheck/pages/profile/store/resetProfileStores'
import * as usePostProfileMutation from 'features/identityCheck/queries/usePostProfileMutation'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

import { ProfileInformationValidationUpdate } from './ProfileInformationValidationUpdate'
jest.mock('features/auth/context/AuthContext')

const refetchUserMock = jest.fn()
mockAuthContextWithUser({ ...beneficiaryUser }, { persist: true, refetchUser: refetchUserMock })

const usePostProfileMutationSpy = jest.spyOn(usePostProfileMutation, 'usePostProfileMutation')
const mockUseMutationError = (error?: ApiError) => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  usePostProfileMutationSpy.mockImplementation(({ onError }) => ({
    // @ts-ignore it's a mock
    mutateAsync: jest.fn(() => onError(error)),
  }))
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('ProfileInformationValidationUpdate', () => {
  it('should render correctly', async () => {
    renderProfileInformationValidationUpdate()

    await screen.findByText('Informations personnelles')

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to UpdatePersonalDataConfirmation when press "Confirmer"', async () => {
    renderProfileInformationValidationUpdate()

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => {
      expect(reset).toHaveBeenCalledWith({
        index: 1,
        routes: [
          {
            name: 'TabNavigator',
            params: { screen: 'Home', params: undefined },
          },
          {
            name: 'ProfileStackNavigator',
            params: { screen: 'UpdatePersonalDataConfirmation', params: undefined },
          },
        ],
      })
    })
  })

  it('should reset profile stores after submission succeeds', async () => {
    const resetStoresSpy = jest.spyOn(resetStores, 'resetProfileStores')
    renderProfileInformationValidationUpdate()

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => {
      expect(resetStoresSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('should refetchUser after submission succeeds', async () => {
    renderProfileInformationValidationUpdate()

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => {
      expect(refetchUserMock).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to ChangeCity when press "Modifier mes informations"', async () => {
    renderProfileInformationValidationUpdate()

    await user.press(screen.getByText('Modifier mes informations'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      screen: 'ChangeCity',
      params: { type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA },
    })
  })

  it('should display "Compléter mes informations" and navigate to ChangeCity when press', async () => {
    mockAuthContextWithUser({ ...beneficiaryUser, street: undefined })
    renderProfileInformationValidationUpdate()

    await user.press(screen.getByText('Compléter mes informations'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      screen: 'ChangeCity',
      params: { type: PersonalDataTypes.MANDATORY_UPDATE_PERSONAL_DATA },
    })
  })

  it('should show error snackbar if posting profile fails', async () => {
    mockUseMutationError({ content: {}, name: 'ApiError', statusCode: 400, message: 'erreur' })
    renderProfileInformationValidationUpdate()

    await user.press(screen.getByText('Confirmer'))

    await waitFor(() => {
      expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
      expect(screen.getByText('Une erreur est survenue')).toBeOnTheScreen()
    })
  })
})

const renderProfileInformationValidationUpdate = () => {
  return render(reactQueryProviderHOC(<ProfileInformationValidationUpdate />))
}
