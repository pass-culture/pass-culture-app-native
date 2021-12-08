import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { NoContentError } from 'features/home/components/NoContentError'
import { fireEvent, render } from 'tests/utils'

describe('NoContentError', () => {
  it('should render correctly', () => {
    const renderAPI = render(<NoContentError />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should redirect to Search tab when pressing the button', () => {
    const { getByText } = render(<NoContentError />)
    const searchButton = getByText('Rechercher une offre')
    fireEvent.press(searchButton)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { screen: 'Search' })
  })
})
