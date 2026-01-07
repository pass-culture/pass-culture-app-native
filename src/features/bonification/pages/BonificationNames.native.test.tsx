import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationNames } from 'features/bonification/pages/BonificationNames'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('BonificationNames', () => {
  it('should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationNames />)

    const firstNameField = screen.getByTestId('Entrée pour le prénom')
    await userEvent.type(firstNameField, 'Jaques')

    const birthNameField = screen.getByTestId('Entrée pour le nom')
    await userEvent.type(birthNameField, 'Dupont')

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationTitle',
    })
  })

  it('should go back when pressing go back button', async () => {
    render(<BonificationNames />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should navigate to FAQ if button pressed', async () => {
    render(<BonificationNames />)

    const button = screen.getByText('Je ne connais pas son nom de naissance')
    await userEvent.press(button)

    expect(openUrl).toHaveBeenCalledWith(
      'https://aide.passculture.app/hc/fr/articles/24338766387100-FAQ-Bonif'
    )
  })

  it('should not navigate if required fields are empty', async () => {
    render(<BonificationNames />)

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).not.toHaveBeenCalled()
  })

  it('should disable the "Continuer" button when form is invalid', () => {
    render(<BonificationNames />)

    const button = screen.getByText('Continuer')

    expect(button).toBeDisabled()
  })

  it('should submit successfully even if common name is empty', async () => {
    render(<BonificationNames />)

    await userEvent.type(screen.getByTestId('Entrée pour le prénom'), 'Jean')
    await userEvent.type(screen.getByTestId('Entrée pour le nom'), 'Dupont')

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationTitle',
    })
  })

  describe('Data persistence', () => {
    beforeEach(() => {
      const { resetLegalRepresentative } = legalRepresentativeActions
      resetLegalRepresentative()
    })

    it('should show previously saved data if there is any', () => {
      const { setFirstNames } = legalRepresentativeActions
      const firstName = 'Jean'
      setFirstNames([firstName])
      render(<BonificationNames />)

      const firstNameField = screen.getByDisplayValue(firstName)

      expect(firstNameField.props.value).toBe(firstName)
    })

    it('should save form to store when pressing "Continuer"', async () => {
      const setFirstNameSpy = jest.spyOn(legalRepresentativeActions, 'setFirstNames')
      const setGivenNameSpy = jest.spyOn(legalRepresentativeActions, 'setGivenName')

      render(<BonificationNames />)

      const firstNameField = screen.getByTestId('Entrée pour le prénom')
      await userEvent.type(firstNameField, 'Jaques')

      const addButton = screen.getByText('Ajouter un prénom')
      await userEvent.press(addButton)

      const secondNameField = screen.getByTestId('Entrée pour le deuxieme prénom')
      await userEvent.type(secondNameField, 'Marie')

      const birthNameField = screen.getByTestId('Entrée pour le nom')
      await userEvent.type(birthNameField, 'Dupont')

      const button = screen.getByText('Continuer')
      await userEvent.press(button)

      expect(setFirstNameSpy).toHaveBeenCalledWith(['Jaques', 'Marie'])
      expect(setGivenNameSpy).toHaveBeenCalledWith('Dupont')
    })
  })
})
