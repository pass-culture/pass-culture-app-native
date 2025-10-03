import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BonificationRecap } from 'features/bonification/pages/BonificationRecap'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

describe('BonificationRecap', () => {
  it('Should navigate to next form when pressing "Envoyer" when checkbox is checked', async () => {
    render(<BonificationRecap />)

    const checkbox = screen.getByText(
      'Je déclare que l’ensemble des informations que j’ai renseignées sont correctes.'
    )
    await userEvent.press(checkbox)

    const button = screen.getByText('Envoyer')
    await userEvent.press(button)

    await jest.runAllTimers() // to account for the setTimout (will be removed when real API is called)

    expect(navigate).toHaveBeenCalledWith('BonificationError')
  })

  it('Should go navigate to first screen when pressing "Modifier les informations"', async () => {
    render(<BonificationRecap />)

    const button = screen.getByText('Modifier les informations')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('BonificationNames')
  })
})
