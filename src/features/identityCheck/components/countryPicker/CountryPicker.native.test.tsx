import React from 'react'

import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { act, fireEvent, render, screen } from 'tests/utils'

const onSelectCountry = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<CountryPicker />', () => {
  it('should render correctly', async () => {
    render(<CountryPicker selectedCountry={METROPOLITAN_FRANCE} onSelect={onSelectCountry} />)

    expect(
      screen.getByTestId('Ouvrir la modale de choix de l’indicatif téléphonique')
    ).toBeOnTheScreen()
  })

  it('should select the correct country calling code when the user select a calling code', async () => {
    render(<CountryPicker selectedCountry={METROPOLITAN_FRANCE} onSelect={onSelectCountry} />)

    fireEvent.press(
      await screen.findByTestId('Ouvrir la modale de choix de l’indicatif téléphonique')
    )
    fireEvent.press(screen.getByLabelText('Guadeloupe +590'))

    await act(async () => {
      expect(onSelectCountry).toHaveBeenCalledWith({
        id: 'GP',
        name: 'Guadeloupe',
        callingCode: '590',
      })
    })
  })
})
