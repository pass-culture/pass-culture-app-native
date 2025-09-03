import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
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
  it('should render correctly', () => {
    render(<AccessibilityDeclarationWeb />)

    expect(screen).toMatchSnapshot()
  })

  it.each`
    url                                                    | title
    ${`${WEBAPP_V2_URL}/accueil`}                          | ${'Accueil'}
    ${`${WEBAPP_V2_URL}/creation-compte`}                  | ${'Inscription - Date de naissance'}
    ${`${WEBAPP_V2_URL}/connexion`}                        | ${'Connexion'}
    ${`${WEBAPP_V2_URL}/verification-identite`}            | ${'Vérification d’identité'}
    ${`${WEBAPP_V2_URL}/profil`}                           | ${'Profil'}
    ${`${WEBAPP_V2_URL}/profil/modification-mot-de-passe`} | ${'Modification de mot de passe'}
    ${`${WEBAPP_V2_URL}/favoris`}                          | ${'Favoris'}
    ${`${WEBAPP_V2_URL}/recherche`}                        | ${'Recherche'}
    ${`${WEBAPP_V2_URL}/accessibilite/declaration`}        | ${'Déclaration d’accessibilité'}
    ${'https://formulaire.defenseurdesdroits.fr/'}         | ${'Défenseur des droits'}
    ${'https://www.defenseurdesdroits.fr/saisir/delegues'} | ${'Défenseur des droits dans votre région'}
  `('should open $url when $title is clicked', async ({ url, title }) => {
    render(<AccessibilityDeclarationWeb />)

    const link = screen.getByText(title)
    await user.press(link)

    expect(openURLSpy).toHaveBeenCalledWith(url, undefined, true)
  })
})
