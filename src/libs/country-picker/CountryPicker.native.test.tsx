import React from 'react'

import { CountryPicker, METROPOLITAN_FRANCE } from 'libs/country-picker'
import { act, flushAllPromises, render, fireEvent } from 'tests/utils'

const onSelectCountry = jest.fn()

describe('<CountryPicker />', () => {
  it('should render correctly', async () => {
    const renderAPI = render(
      <CountryPicker initialCountry={METROPOLITAN_FRANCE} onSelect={onSelectCountry} />
    )
    await act(flushAllPromises)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should select the correct country calling code when the user select a calling code', async () => {
    const { getByText, getByTestId } = render(
      <CountryPicker initialCountry={METROPOLITAN_FRANCE} onSelect={onSelectCountry} />
    )
    await act(flushAllPromises)
    fireEvent.press(getByTestId("Ouvrir la modale de choix de l'indicatif téléphonique"))
    fireEvent.press(getByText('Guadeloupe (+590)'))

    await act(async () => {
      expect(onSelectCountry).toBeCalledWith({
        callingCode: ['590'],
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
