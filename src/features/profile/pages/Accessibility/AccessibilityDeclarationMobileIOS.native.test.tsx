import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityDeclarationMobileIOS } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileIOS'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { render, userEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')
const IOS_STORE_LINK = `https://apps.apple.com/fr/app/pass-culture/id${env.IOS_APP_STORE_ID}`

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('AccessibilityDeclarationMobileIOS', () => {
  it('should render correctly', () => {
    render(<AccessibilityDeclarationMobileIOS />)

    expect(screen).toMatchSnapshot()
  })

  it.each`
    url                                                    | title
    ${IOS_STORE_LINK}                                      | ${'l’application iOS'}
    ${'https://formulaire.defenseurdesdroits.fr/'}         | ${'Défenseur des droits'}
    ${'https://www.defenseurdesdroits.fr/saisir/delegues'} | ${'Défenseur des droits dans votre région'}
  `('should open $url when $title is clicked', async ({ url, title }) => {
    render(<AccessibilityDeclarationMobileIOS />)

    const link = screen.getByText(title)
    await user.press(link)

    expect(openURLSpy).toHaveBeenCalledWith(url, undefined, true)
  })

  it('should log HasClickedContactForm event when press "contacter le support" button', async () => {
    render(<AccessibilityDeclarationMobileIOS />)

    const contactSupportButton = screen.getByText('contacter le support')

    await userEvent.press(contactSupportButton)

    expect(analytics.logHasClickedContactForm).toHaveBeenNthCalledWith(
      1,
      'AccessibilityDeclaration'
    )
  })
})
