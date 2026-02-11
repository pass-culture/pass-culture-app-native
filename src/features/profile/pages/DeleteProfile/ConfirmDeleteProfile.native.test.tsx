import React from 'react'

import { reset, goBack } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { ConfirmDeleteProfile } from './ConfirmDeleteProfile'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

jest.useFakeTimers()

describe('ConfirmDeleteProfile component', () => {
  it('should render confirm delete profile', () => {
    renderConfirmDeleteProfile()

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to DeactivateProfileSuccess when clicking on "Supprimer mon compte" button', async () => {
    mockServer.postApi('/v1/account/suspend', {})
    renderConfirmDeleteProfile()

    await user.press(screen.getByText('Supprimer mon compte'))

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [
        {
          name: 'TabNavigator',
          state: {
            routes: [
              {
                name: 'ProfileStackNavigator',
                state: { routes: [{ name: 'DeactivateProfileSuccess' }] },
              },
            ],
          },
        },
      ],
    })
  })

  it('should show error snackbar if suspend account request fails when clicking on "Supprimer mon compte" button', async () => {
    mockServer.postApi('/v1/account/suspend', { responseOptions: { statusCode: 400 } })
    renderConfirmDeleteProfile()

    await user.press(screen.getByText('Supprimer mon compte'))

    expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
    expect(screen.getByText('Une erreur s’est produite pendant le chargement.')).toBeOnTheScreen()
  })

  it('should log analytics and redirect to FAQ when clicking on FAQ link', async () => {
    renderConfirmDeleteProfile()

    await user.press(screen.getByText('Consulter l’article d’aide'))

    expect(analytics.logConsultArticleAccountDeletion).toHaveBeenCalledTimes(1)
    expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_DELETE_ACCOUNT, undefined, true)
  })

  it('should go back when clicking on go back button', async () => {
    renderConfirmDeleteProfile()

    await user.press(screen.getByTestId('Revenir en arrière'))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should open CGU when clicking on "conditions générales d’utilisation"', async () => {
    renderConfirmDeleteProfile()

    await user.press(screen.getByText('conditions générales d’utilisation'))

    expect(openUrl).toHaveBeenNthCalledWith(1, env.CGU_LINK, undefined, true)
  })
})

function renderConfirmDeleteProfile() {
  return render(reactQueryProviderHOC(<ConfirmDeleteProfile />))
}
