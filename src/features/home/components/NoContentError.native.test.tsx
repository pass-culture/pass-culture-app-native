import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NoContentError } from 'features/home/components/NoContentError'
import { fireEvent, render, screen } from 'tests/utils'

describe('NoContentError', () => {
  it('should render correctly', () => {
    render(<NoContentError />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should redirect to Search tab when pressing the button', () => {
    render(<NoContentError />)
    const searchButton = screen.getByText('Rechercher une offre')
    fireEvent.press(searchButton)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Search' })
  })
})
