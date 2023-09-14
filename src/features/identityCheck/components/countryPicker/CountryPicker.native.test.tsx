import React from 'react'

import { METROPOLITAN_FRANCE } from 'features/identityCheck/components/countryPicker/constants'
import { CountryPicker } from 'features/identityCheck/components/countryPicker/CountryPicker'
import { act, render, fireEvent, screen } from 'tests/utils'

const onSelectCountry = jest.fn()

describe('<CountryPicker />', () => {
  it('should render correctly', async () => {
    render(<CountryPicker selectedCountry={METROPOLITAN_FRANCE} onSelect={onSelectCountry} />)
    await screen.findByTestId('Ouvrir la modale de choix de l’indicatif téléphonique')

    expect(screen).toMatchSnapshot()
  })

  it('should select the correct country calling code when the user select a calling code', async () => {
    render(<CountryPicker selectedCountry={METROPOLITAN_FRANCE} onSelect={onSelectCountry} />)

    fireEvent.press(
      await screen.findByTestId('Ouvrir la modale de choix de l’indicatif téléphonique')
    )
    fireEvent.press(screen.getByText('Guadeloupe (+590)'))

    await act(async () => {
      expect(onSelectCountry).toBeCalledWith({
        callingCode: '590',
        cca2: 'GP',
        currency: ['EUR'],
        flag: 'flag-gp',
        name: 'Guadeloupe',
        region: 'Americas',
        subregion: 'Caribbean',
      })
    })
  })
})
