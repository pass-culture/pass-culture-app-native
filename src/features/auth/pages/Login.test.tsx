import { StackScreenProps } from '@react-navigation/stack'
import { render, fireEvent, act } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'
import waitForExpect from 'wait-for-expect'

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

function renderLogin() {
  return render(
    <Login {...(navigationTestProps as StackScreenProps<RootStackParamList, 'Login'>)} />
  )
}

describe('<Login/>', () => {
  it('should redirect to home page WHEN signin is successful', async () => {
    const { findByText } = renderLogin()

    const connexionButton = await findByText('Se connecter')
    fireEvent.press(connexionButton)

    await waitForExpect(() => {
      expect(analytics.logLogin).toBeCalledTimes(1)
      expect(navigationTestProps.navigation.navigate).toBeCalledTimes(1)
      expect(navigationTestProps.navigation.navigate).toHaveBeenCalledWith('Home', {
        shouldDisplayLoginModal: false,
      })
    })
  })

  it('should show error message and error inputs AND not redirect to home page WHEN signin has failed', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/signin', async (req, res, ctx) =>
        res(ctx.status(401))
      )
    )
    const { findByText, toJSON } = renderLogin()
    const notErrorSnapshot = toJSON()

    const connexionButton = await findByText('Se connecter')
    await act(async () => {
      fireEvent.press(connexionButton)
      await flushAllPromises()
    })

    await waitForExpect(() => {
      const errorSnapshot = toJSON()
      expect(notErrorSnapshot).toMatchDiffSnapshot(errorSnapshot)
      expect(analytics.logLogin).not.toBeCalled()
      expect(navigationTestProps.navigation.navigate).not.toBeCalled()
    })
  })
})
