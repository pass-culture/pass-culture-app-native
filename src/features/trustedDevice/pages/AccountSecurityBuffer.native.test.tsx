import React from 'react'
import { withErrorBoundary } from 'react-error-boundary'

import { replace, useRoute } from '__mocks__/@react-navigation/native'
import { UpdateEmailTokenExpiration } from 'api/gen'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { ROUTE_PARAMS } from 'features/trustedDevice/fixtures/fixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'
import { Typo } from 'ui/theme'

import { AccountSecurityBuffer } from './AccountSecurityBuffer'

jest.unmock('jwt-decode')
jest.mock('features/navigation/helpers/navigateToHome')

const consoleError = console.error
const catchErrorSilently = async (fn: () => Promise<unknown>) => {
  try {
    console.error = jest.fn()
    return await fn()
  } catch (error) {
    return error
  } finally {
    console.error = consoleError
  }
}

describe('<AccountSecurityBuffer/>', () => {
  beforeEach(() => {
    setFeatureFlags()
    useRoute
      .mockReturnValueOnce({ params: ROUTE_PARAMS })
      .mockReturnValueOnce({ params: ROUTE_PARAMS })
  })

  it('should display loading page when is loading', async () => {
    mockServer.getApi<UpdateEmailTokenExpiration>(
      `/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
      {
        responseOptions: { delay: 1000, statusCode: 200, data: {} },
        requestOptions: { persist: true },
      }
    )
    renderAccountSecurityBuffer()

    const LOADING_TEXT = 'Chargement en cours...'

    expect(await screen.findByText(LOADING_TEXT)).toBeOnTheScreen()
  })

  it('should navigate to SuspensionChoiceExpiredLink screen when expired token', async () => {
    mockServer.getApi<UpdateEmailTokenExpiration>(
      `/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
      {
        responseOptions: { statusCode: 401, data: {} },
      }
    )
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(replace).toHaveBeenNthCalledWith(1, 'SuspensionChoiceExpiredLink')
    })
  })

  it('should navigate to Home when invalid token', async () => {
    mockServer.getApi<UpdateEmailTokenExpiration>(
      `/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
      {
        responseOptions: { statusCode: 400, data: {} },
      }
    )
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })

  it('should navigate to AccountSecurity screen when valid token', async () => {
    mockServer.getApi<UpdateEmailTokenExpiration>(
      `/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
      {}
    )
    renderAccountSecurityBuffer()

    await waitFor(() => {
      expect(replace).toHaveBeenNthCalledWith(1, 'AccountSecurity', ROUTE_PARAMS)
    })
  })

  it('should throw error when unexpected error happens while validating token', async () => {
    mockServer.getApi<UpdateEmailTokenExpiration>(
      `/v1/account/suspend/token_validation/${ROUTE_PARAMS.token}`,
      {
        responseOptions: { statusCode: 500 },
      }
    )
    const spy = jest.fn()

    const Component = withErrorBoundary(AccountSecurityBuffer, {
      fallback: <Typo.Body>Error</Typo.Body>,
      onError: spy,
    })
    await catchErrorSilently(async () => {
      render(reactQueryProviderHOC(<Component />))

      await screen.findAllByText('Error')
    })

    expect(spy).toHaveBeenCalledTimes(1)
  })
})

const renderAccountSecurityBuffer = () => render(reactQueryProviderHOC(<AccountSecurityBuffer />))
