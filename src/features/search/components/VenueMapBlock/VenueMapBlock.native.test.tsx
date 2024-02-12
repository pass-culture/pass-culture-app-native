import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueMapBlock } from 'features/search/components/VenueMapBlock/VenueMapBlock'
import { fireEvent, render, screen } from 'tests/utils'

describe('<VenueMapBlock />', () => {
  it('should display title venue map', () => {
    render(<VenueMapBlock />)

    expect(screen.getByText('Carte des lieux culturels')).toBeOnTheScreen()
  })

  it('should display card text', () => {
    render(<VenueMapBlock />)

    expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
  })

  it('should navigate to cheat codes', () => {
    render(<VenueMapBlock />)

    fireEvent.press(screen.getByText('Explorer les lieux'))

    expect(navigate).toHaveBeenCalledWith('CheatCodes', undefined)
  })
})
