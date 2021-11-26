import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { NotConnectedFavorites } from '../NotConnectedFavorites'

describe('NotConnectedFavorites component', () => {
  it('should render not connected favorites', () => {
    const renderAPI = render(<NotConnectedFavorites />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should navigate to SignupForm on button click', () => {
    const renderAPI = render(<NotConnectedFavorites />)
    fireEvent.press(renderAPI.getByText(`S'inscrire`))
    expect(navigate).toBeCalledWith('SignupForm')
  })

  it('should navigate to Login on button click', () => {
    const renderAPI = render(<NotConnectedFavorites />)
    fireEvent.press(renderAPI.getByText(`Se connecter`))
    expect(navigate).toBeCalledWith('Login')
  })
})
