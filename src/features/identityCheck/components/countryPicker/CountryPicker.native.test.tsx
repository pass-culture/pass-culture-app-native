import React from 'react'

import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { render, screen, userEvent } from 'tests/utils'

const onSelectCountry = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<CountryPicker />', () => {
  it('should render correctly', async () => {
    render(<CountryPicker selectedCountry={METROPOLITAN_FRANCE} onSelect={onSelectCountry} />)

    expect(
      screen.getByTestId('+33 - Ouvrir la modale de choix de l’indicatif téléphonique')
    ).toBeOnTheScreen()
  })

  it('should select the correct country calling code when the user select a calling code', async () => {
    render(<CountryPicker selectedCountry={METROPOLITAN_FRANCE} onSelect={onSelectCountry} />)

    await user.press(
      await screen.findByTestId('+33 - Ouvrir la modale de choix de l’indicatif téléphonique')
    )
    await user.press(screen.getByLabelText('Guadeloupe +590'))

    expect(onSelectCountry).toHaveBeenCalledWith({
      id: 'GP',
      name: 'Guadeloupe',
      callingCode: '590',
    })
  })
})
