import { rest } from 'msw'
import React from 'react'
import { withErrorBoundary } from 'react-error-boundary'
import { Text } from 'react-native'

import { useRoute } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, render, screen } from 'tests/utils'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

import { AccountSecurityBuffer } from './AccountSecurityBuffer'

jest.unmock('jwt-decode')
jest.mock('features/navigation/helpers')

const TOKEN = 'token.123.token'

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
      .mockReturnValueOnce({ params: { token: TOKEN } })
      .mockReturnValueOnce({ params: { token: TOKEN } })
  })

  it('should display loading page when is loading', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${TOKEN}`,
        (_req, res, ctx) => res(ctx.delay(1000))
      )
    )
    renderAccountSecurityBuffer()

    const LOADING_TEXT = 'Chargement en cours...'
    expect(await screen.findByText(LOADING_TEXT)).toBeTruthy()
  })

  it('should display SuspensionChoiceExpiredLink screen when expired token', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${TOKEN}`,
        (_req, res, ctx) => res(ctx.status(401))
      )
    )
    renderAccountSecurityBuffer()

    const SUSPENSION_CHOICE_EXPIRED_LINK_TITLE = `Le lien que tu reçois par e-mail expire 7 jours après sa réception.${DOUBLE_LINE_BREAK}Tu peux toujours contacter le service fraude pour sécuriser ton compte.`
    expect(await screen.findByText(SUSPENSION_CHOICE_EXPIRED_LINK_TITLE)).toBeTruthy()
  })

  it('should navigate to Home when invalid token', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${TOKEN}`,
        (_req, res, ctx) => res(ctx.status(400))
      )
    )
    renderAccountSecurityBuffer()

    await act(async () => {})

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  it('should display AccountSecurity screen when valid token', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${TOKEN}`,
        (_req, res, ctx) => res(ctx.status(200))
      )
    )
    renderAccountSecurityBuffer()

    const ACCOUNT_SECURITY_TITLE = 'Sécurise ton compte'
    expect(await screen.findByText(ACCOUNT_SECURITY_TITLE)).toBeTruthy()
  })

  it('should throw error when unexpected error happens while validating token', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/account/suspend/token_validation/${TOKEN}`,
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

      await screen.findAllByText('Error')
    })

    expect(spy).toHaveBeenCalledTimes(1)
  })
})

const renderAccountSecurityBuffer = () =>
  render(
    // @ts-ignore Buffer return components or navigation to Home
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(<AccountSecurityBuffer />)
  )
