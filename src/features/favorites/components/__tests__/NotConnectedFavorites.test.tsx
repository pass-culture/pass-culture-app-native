import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'

import { NotConnectedFavorites } from '../NotConnectedFavorites'

describe('NotConnectedFavorites component', () => {
  it('should render not connected favorites', () => {
    const renderAPI = render(<NotConnectedFavorites />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should navigate to login on button click', () => {
    const renderAPI = render(<NotConnectedFavorites />)
    fireEvent.press(renderAPI.getByText(`S'inscrire`))
    expect(navigate).toBeCalledWith('SetEmail')
  })

  it('should navigate to register on button click', () => {
    const renderAPI = render(<NotConnectedFavorites />)
    fireEvent.press(renderAPI.getByText(`Se connecter`))
    expect(navigate).toBeCalledWith('Login')
  })
})
