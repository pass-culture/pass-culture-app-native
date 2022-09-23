import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { NotConnectedFavorites } from '../NotConnectedFavorites'

describe('NotConnectedFavorites component', () => {
  it('should render not connected favorites', () => {
    const renderAPI = render(<NotConnectedFavorites />)
    expect(renderAPI.toJSON()).toMatchSnapshot()
  })

  it('should navigate to SignupForm on button click and log analytics', async () => {
    const renderAPI = render(<NotConnectedFavorites />)
    fireEvent.press(renderAPI.getByText(`S’inscrire`))

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('SignupForm', undefined)
      expect(analytics.logSignUpFromFavorite).toBeCalledTimes(1)
    })
  })

  it('should navigate to Login on button click log analytics', async () => {
    const renderAPI = render(<NotConnectedFavorites />)
    fireEvent.press(renderAPI.getByText(`Se connecter`))

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith('Login', undefined)
      expect(analytics.logSignInFromFavorite).toBeCalledTimes(1)
    })
  })
})
