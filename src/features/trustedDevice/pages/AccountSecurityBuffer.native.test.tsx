import React from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { Text } from 'react-native'

import { useRoute, replace } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
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
    mockServer.getAPIV1(`/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`, {
      responseOptions: { delay: 1000, statusCode: 200, data: {} },
      requestOptions: { persist: true },
    })
    renderAccountSecurityBuffer()

    const LOADING_TEXT = 'Chargement en cours...'
    expect(await screen.findByText(LOADING_TEXT)).toBeOnTheScreen()
  })

  it('should navigate to SuspensionChoiceExpiredLink screen when expired token', async () => {
    mockServer.getAPIV1(`/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`, {
      responseOptions: { statusCode: 401, data: {} },
    })
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(replace).toHaveBeenNthCalledWith(1, 'SuspensionChoiceExpiredLink')
    })
  })

  it('should navigate to Home when invalid token', async () => {
    mockServer.getAPIV1(`/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`, {
      responseOptions: { statusCode: 400, data: {} },
    })
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to AccountSecurity screen when valid token', async () => {
    mockServer.getAPIV1(`/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`, {})
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(replace).toHaveBeenNthCalledWith(1, 'AccountSecurity', ROUTE_PARAMS)
    })
  })

  it('should throw error when unexpected error happens while validating token', async () => {
    mockServer.getAPIV1(`/native/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`, {
      responseOptions: { statusCode: 500, data: {} },
    })
    const spy = jest.fn()

    const Component = withErrorBoundary(AccountSecurityBuffer, {
      fallback: <Text>Error</Text>,
      onError: spy,
    })
    await catchErrorSilently(async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      render(reactQueryProviderHOC(<Component />))

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
