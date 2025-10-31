import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationNames } from 'features/bonification/pages/BonificationNames'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationNames', () => {
  it('should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationNames />)

    const firstNameField = screen.getByTestId('Entrée pour le prénom')
    await userEvent.type(firstNameField, 'Jaques')
    const birthNameField = screen.getByTestId('Entrée pour le nom')
    await userEvent.type(birthNameField, 'Dupont')

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationTitle')
  })

  it('should go back when pressing go back button', async () => {
    render(<BonificationNames />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
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
      const birthNameField = screen.getByTestId('Entrée pour le nom')
      await userEvent.type(birthNameField, 'Dupont')

      const button = screen.getByText('Continuer')
      await userEvent.press(button)

      expect(setFirstNameSpy).toHaveBeenCalledWith(['Jaques'])
      expect(setGivenNameSpy).toHaveBeenCalledWith('Dupont')
    })
  })
})
