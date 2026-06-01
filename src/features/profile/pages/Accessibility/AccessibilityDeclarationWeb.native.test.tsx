import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { SearchView } from 'features/search/types'
import { render, userEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('AccessibilityDeclarationWeb', () => {
  beforeEach(() => {
    openURLSpy.mockClear()
    navigate.mockClear()
  })

  it('should render correctly', () => {
    render(<AccessibilityDeclarationWeb />)

    expect(screen).toMatchSnapshot()
  })

  it.each`
    screen                          | params                                                                        | title
    ${'TabNavigator'}               | ${{ screen: 'Home', params: undefined }}                                      | ${'Accueil'}
    ${'SignupForm'}                 | ${undefined}                                                                  | ${'Inscription - Date de naissance'}
    ${'Login'}                      | ${undefined}                                                                  | ${'Connexion'}
    ${'SubscriptionStackNavigator'} | ${undefined}                                                                  | ${'Vérification d’identité'}
    ${'TabNavigator'}               | ${{ screen: 'Profile', params: undefined }}                                   | ${'Profil'}
    ${'ProfileStackNavigator'}      | ${{ screen: 'ChangePassword', params: undefined }}                            | ${'Modification de mot de passe'}
    ${'TabNavigator'}               | ${{ screen: 'Favorites', params: undefined }}                                 | ${'Favoris'}
    ${'TabNavigator'}               | ${{ screen: 'SearchStackNavigator', params: { screen: SearchView.Landing } }} | ${'Recherche'}
    ${'ProfileStackNavigator'}      | ${{ screen: 'AccessibilityDeclarationWeb', params: undefined }}               | ${'Déclaration d’accessibilité'}
  `(
    'should navigate to $screen when $title is clicked',
    async ({ screen: screenName, params, title }) => {
      render(<AccessibilityDeclarationWeb />)

      const link = screen.getByText(title)
      await user.press(link)

      expect(navigate).toHaveBeenCalledWith(screenName, params)
    }
  )

  it.each`
    url                                                    | title
    ${'https://formulaire.defenseurdesdroits.fr/'}         | ${'Défenseur des droits'}
    ${'https://www.defenseurdesdroits.fr/saisir/delegues'} | ${'Défenseur des droits dans votre région'}
  `('should open $url when $title is clicked', async ({ url, title }) => {
    render(<AccessibilityDeclarationWeb />)

    const link = screen.getByText(title)
    await user.press(link)

    expect(openURLSpy).toHaveBeenCalledWith(url, undefined, true)
  })
})
