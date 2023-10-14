import { rest } from 'msw'
import React from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { Text } from 'react-native'

import { useRoute, replace } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, screen, waitFor } from 'tests/utils'

import { AccountSecurityBuffer } from './AccountSecurityBuffer'

jest.unmock('jwt-decode')
jest.mock('features/navigation/helpers')

const consoleError = console.error
const catchErrorSilently = async (fn: () => Promise<unknown>) => {
  try {
    console.error = () => {}
    return await fn()
  } catch (error) {
    return error
  } finally {
    console.error = consoleError
  }
}

describe('<AccountSecurityBuffer/>', () => {
  beforeEach(() => {
    useRoute
      .mockReturnValueOnce({ params: ROUTE_PARAMS })
      .mockReturnValueOnce({ params: ROUTE_PARAMS })
  })

  it('should display loading page when is loading', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
        (_req, res, ctx) => res(ctx.delay(1000))
      )
    )
    renderAccountSecurityBuffer()

    const LOADING_TEXT = 'Chargement en cours...'
    expect(await screen.findByText(LOADING_TEXT)).toBeOnTheScreen()
  })

  it('should navigate to SuspensionChoiceExpiredLink screen when expired token', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
        (_req, res, ctx) => res(ctx.status(401))
      )
    )
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(replace).toHaveBeenNthCalledWith(1, 'SuspensionChoiceExpiredLink')
    })
  })

  it('should navigate to Home when invalid token', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
        (_req, res, ctx) => res(ctx.status(400))
      )
    )
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to AccountSecurity screen when valid token', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
        (_req, res, ctx) => res(ctx.status(200))
      )
    )
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(replace).toHaveBeenNthCalledWith(1, 'AccountSecurity', ROUTE_PARAMS)
    })
  })

  it('should throw error when unexpected error happens while validating token', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
        (_req, res, ctx) => res(ctx.status(500))
      )
    )
    const spy = jest.fn()

    const Component = withErrorBoundary(AccountSecurityBuffer, {
      fallback: <Text>Error</Text>,
      onError: spy,
    })
    await catchErrorSilently(async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<Component />))

      // eslint-disable-next-line testing-library/prefer-explicit-assert
      await screen.findAllByText('Error')
    })

    expect(spy).toHaveBeenCalledTimes(1)
  })
})

const renderAccountSecurityBuffer = () =>
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<AccountSecurityBuffer />)
  )
