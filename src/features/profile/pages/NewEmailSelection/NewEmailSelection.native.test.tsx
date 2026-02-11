import React from 'react'

import { replace, useRoute } from '__mocks__/@react-navigation/native'
import { NewEmailSelection } from 'features/profile/pages/NewEmailSelection/NewEmailSelection'
import { EmptyResponse } from 'libs/fetch'
import { eventMonitoring } from 'libs/monitoring/services'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import {
  act,
  fireEvent,
  render,
  renderAsync,
  screen,
  userEvent,
  waitForButtonToBePressable,
} from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

useRoute.mockReturnValue({ params: { token: 'new_email_selection_token' } })

jest.mock('libs/jwt/jwt')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

describe('<NewEmailSelection />', () => {
  it('should match snapshot', () => {
    render(reactQueryProviderHOC(<NewEmailSelection />))

    expect(screen).toMatchSnapshot()
  })

  it('should enable submit button when email input is filled', async () => {
    render(reactQueryProviderHOC(<NewEmailSelection />))

    const emailInput = screen.getByTestId('Entrée pour l’email')
    fireEvent.changeText(emailInput, 'john.doe@gmail.com')

    const button = await screen.findByLabelText('Modifier mon adresse e-mail')

    await waitForButtonToBePressable(button)

    expect(button).toBeEnabled()
  })

  it('should disable submit button when email input is invalid', async () => {
    render(reactQueryProviderHOC(<NewEmailSelection />))

    const emailInput = screen.getByTestId('Entrée pour l’email')
    fireEvent.changeText(emailInput, 'john.doe')

    expect(await screen.findByLabelText('Modifier mon adresse e-mail')).toBeDisabled()
  })

  it('should navigate to email change stepper on new email selection success', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/new_email', {
      responseOptions: {
        statusCode: 204,
      },
    })
    render(reactQueryProviderHOC(<NewEmailSelection />))

    const emailInput = screen.getByTestId('Entrée pour l’email')
    await act(async () => {
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    await user.press(screen.getByLabelText('Modifier mon adresse e-mail'))

    expect(replace).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'TrackEmailChange',
    })
  })

  it('should show success snackbar on new email selection success', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/new_email', {
      responseOptions: {
        statusCode: 204,
      },
    })
    render(reactQueryProviderHOC(<NewEmailSelection />))

    const emailInput = screen.getByTestId('Entrée pour l’email')
    await act(async () => {
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    await user.press(screen.getByLabelText('Modifier mon adresse e-mail'))

    expect(screen.getByTestId('snackbar-success')).toBeOnTheScreen()
    expect(
      screen.getByText(
        'E-mail envoyé sur ta nouvelle adresse\u00a0! Tu as 24h pour valider ta demande. Si tu ne le trouves pas, pense à vérifier tes spams.'
      )
    ).toBeOnTheScreen()
  })

  it('should show log to sentry if token is undefined', async () => {
    const routeWithUndefinedToken = { params: { token: undefined } }
    useRoute.mockReturnValueOnce(routeWithUndefinedToken)
    useRoute.mockReturnValueOnce(routeWithUndefinedToken) // There is probably a second render

    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/new_email', {
      responseOptions: {
        statusCode: 204,
      },
    })
    render(reactQueryProviderHOC(<NewEmailSelection />))

    const emailInput = screen.getByTestId('Entrée pour l’email')
    await act(async () => {
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    await user.press(screen.getByLabelText('Modifier mon adresse e-mail'))

    expect(screen.queryByTestId('snackbar-success')).toBeNull()
    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      new Error('Expected a string, but received undefined')
    )
  })

  it('should show error snackbar on new email selection failure', async () => {
    mockServer.postApi<EmptyResponse>('/v2/profile/email_update/new_email', {
      responseOptions: {
        statusCode: 400,
      },
    })
    render(reactQueryProviderHOC(<NewEmailSelection />))

    const emailInput = screen.getByTestId('Entrée pour l’email')
    await act(async () => {
      fireEvent.changeText(emailInput, 'john.doe@gmail.com')
    })

    await user.press(screen.getByLabelText('Modifier mon adresse e-mail'))

    expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
    expect(
      screen.getByText(
        'Une erreur s’est produite lors du choix de l’adresse e-mail. Réessaie plus tard.'
      )
    ).toBeOnTheScreen()
  })

  describe('email format', () => {
    it('should show email suggestion', async () => {
      await renderAsync(reactQueryProviderHOC(<NewEmailSelection />))

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'john.doe@gmal.com')

      expect(
        await screen.findByText('Veux-tu plutôt dire john.doe@gmail.com\u00a0?')
      ).toBeOnTheScreen()
    })

    it('should not display invalid email format when email format is valid', async () => {
      await renderAsync(reactQueryProviderHOC(<NewEmailSelection />))

      const emailInput = await screen.findByTestId('Entrée pour l’email')
      await user.type(emailInput, 'john.doe@example.com')

      expect(
        screen.queryByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr',
          { hidden: true }
        )
      ).not.toBeOnTheScreen()
    })

    it('should display invalid email format when email format is invalid', async () => {
      await renderAsync(reactQueryProviderHOC(<NewEmailSelection />))

      const emailInput = screen.getByTestId('Entrée pour l’email')
      await user.type(emailInput, 'john.doe')

      expect(
        await screen.findByText(
          'L’e-mail renseigné est incorrect. Exemple de format attendu : edith.piaf@email.fr',
          { hidden: true }
        )
      ).toBeOnTheScreen()
    })
  })
})
