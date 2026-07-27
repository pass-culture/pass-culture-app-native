import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityDeclarationWeb } from 'features/profile/pages/Accessibility/AccessibilityDeclarationWeb'
import { env } from 'libs/environment/__mocks__/env'
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
    url                                                                                              | title
    ${'https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf'} | ${'norme européenne 301 549 (v3.2.1)'}
    ${'https://accessibilite.public.lu/fr/raweb1.1/index.html'}                                      | ${'RAWeb version 1.1'}
    ${'https://www.numerique.gouv.fr/publications/rgaa-accessibilite/'}                              | ${'Le RGAA version 4.1'}
    ${env.SUPPORT_ACCOUNT_ISSUES_FORM}                                                               | ${'contacter le support'}
    ${'https://formulaire.defenseurdesdroits.fr/'}                                                   | ${'Défenseur des droits'}
    ${'https://www.defenseurdesdroits.fr/saisir/delegues'}                                           | ${'Défenseur des droits dans votre région'}
  `('should open $url when $title is clicked', async ({ url, title }) => {
    render(<AccessibilityDeclarationWeb />)

    const link = screen.getByText(title)
    await user.press(link)

    expect(openURLSpy).toHaveBeenCalledWith(url, undefined, true)
  })
})
