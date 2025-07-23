import React from 'react'

import { reset, navigate } from '__mocks__/@react-navigation/native'
import { PersonalDataTypes } from 'features/navigation/ProfileStackNavigator/enums'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

import { ProfileInformationValidationUpdate } from './ProfileInformationValidationUpdate'
jest.mock('features/auth/context/AuthContext')
mockAuthContextWithUser({ ...beneficiaryUser })

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
})

const renderProfileInformationValidationUpdate = () => {
  return render(reactQueryProviderHOC(<ProfileInformationValidationUpdate />))
}
