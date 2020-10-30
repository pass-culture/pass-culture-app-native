import { StackScreenProps } from '@react-navigation/stack'
import { render, fireEvent } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'

import { RootStackParamList } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { navigationTestProps } from 'tests/navigation'
import { server } from 'tests/server'
import { flushAllPromises } from 'tests/utils'

import { Login } from './Login'

beforeEach(() => {
  jest.resetAllMocks()
})

describe('<Login/>', () => {
  it('should redirect to home page when signin is successful', async () => {
    const { findByText } = render(
      <Login {...(navigationTestProps as StackScreenProps<RootStackParamList, 'Login'>)} />
    )

    fireEvent.press(await findByText('Connexion'))
    await flushAllPromises()

    expect(analytics.logLogin).toBeCalledTimes(1)
    expect(navigationTestProps.navigation.navigate).toBeCalledTimes(1)
    expect(navigationTestProps.navigation.navigate).toBeCalledWith('Home')
  })

  it('should NOT redirect to home page when signin has failed', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/signin', async (req, res, ctx) =>
        res(ctx.status(401))
      )
    )
    const { findByText } = render(
      <Login {...(navigationTestProps as StackScreenProps<RootStackParamList, 'Login'>)} />
    )

    const connexionButton = await findByText('Connexion')
    fireEvent.press(connexionButton)
    await flushAllPromises()

    expect(analytics.logLogin).not.toBeCalled()
    expect(navigationTestProps.navigation.navigate).not.toBeCalled()
  })
})
