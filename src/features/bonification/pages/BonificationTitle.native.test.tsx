import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationTitle } from 'features/bonification/pages/BonificationTitle'
import { legalRepresentativeActions } from 'features/bonification/store/legalRepresentativeStore'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationTitle', () => {
  it('should navigate to next form when pressing "Continuer" when forms are filled', async () => {
    render(<BonificationTitle />)

    const titleField = screen.getByTestId('Civilité - Monsieur - non sélectionné')
    await userEvent.press(titleField)

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationBirthDate')
  })

  it('should go back when pressing go back button', async () => {
    render(<BonificationTitle />)

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
      const { setTitle } = legalRepresentativeActions
      const title = 'Monsieur'
      setTitle(title)
      render(<BonificationTitle />)

      const titleField = screen.getByTestId('Civilité - Monsieur - sélectionné')

      expect(titleField).toBeOnTheScreen()
    })

    it('should save form to store when pressing "Continuer"', async () => {
      const setTitleSpy = jest.spyOn(legalRepresentativeActions, 'setTitle')

      render(<BonificationTitle />)

      const titleField = screen.getByTestId('Civilité - Monsieur - non sélectionné')
      await userEvent.press(titleField)

      const button = screen.getByText('Continuer')
      await userEvent.press(button)

      expect(setTitleSpy).toHaveBeenCalledWith('Monsieur')
    })
  })
})
