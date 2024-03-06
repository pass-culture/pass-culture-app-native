import React from 'react'

import { NewEmailSelection } from 'features/profile/pages/NewEmailSelection/NewEmailSelection'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, act } from 'tests/utils'
import { SUGGESTION_DELAY_IN_MS } from 'ui/components/inputs/EmailInputWithSpellingHelp/useEmailSpellingHelp'

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<NewEmailSelection />', () => {
  it('should match snapshot', () => {
    render(reactQueryProviderHOC(<NewEmailSelection />))

    expect(screen).toMatchSnapshot()
  })

  it('should enable submit button when email input is filled', async () => {
    render(reactQueryProviderHOC(<NewEmailSelection />))

    const emailInput = screen.getByPlaceholderText('email@exemple.com')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    expect(await screen.findByLabelText('Modifier mon adresse e-mail')).toBeEnabled()
  })

  it('should disable submit button when email input is invalid', async () => {
    render(reactQueryProviderHOC(<NewEmailSelection />))

    const emailInput = screen.getByPlaceholderText('email@exemple.com')
    fireEvent.changeText(emailInput, 'john.doe')

    expect(await screen.findByLabelText('Modifier mon adresse e-mail')).toBeDisabled()
  })

  describe('email format', () => {
    it('should show email suggestion', async () => {
      render(reactQueryProviderHOC(<NewEmailSelection />))

      const emailInput = screen.getByPlaceholderText('email@exemple.com')
      fireEvent.changeText(emailInput, 'john.doe@gmal.com')
      await act(() => jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS))

      expect(screen.getByText('Veux-tu plutôt dire john.doe@gmail.com\u00a0?')).toBeOnTheScreen()
    })

    it('should not display invalid email format when email format is valid', async () => {
      render(reactQueryProviderHOC(<NewEmailSelection />))

      const emailInput = screen.getByPlaceholderText('email@exemple.com')
      await act(() => fireEvent.changeText(emailInput, 'john.doe@example.com'))
      await act(() => jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS))

      expect(
        screen.queryByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      ).not.toBeOnTheScreen()
    })

    it('should display invalid email format when email format is invalid', async () => {
      render(reactQueryProviderHOC(<NewEmailSelection />))

      const emailInput = screen.getByPlaceholderText('email@exemple.com')
      await act(() => fireEvent.changeText(emailInput, 'john.doe'))
      await act(() => jest.advanceTimersByTime(SUGGESTION_DELAY_IN_MS))

      expect(
        screen.getByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr'
        )
      ).toBeOnTheScreen()
    })
  })
})
