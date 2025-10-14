import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityDeclarationMobileAndroid } from 'features/profile/pages/Accessibility/AccessibilityDeclarationMobileAndroid'
import { env } from 'libs/environment/env'
import { render, userEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')
const ANDROID_STORE_LINK = `https://play.google.com/store/apps/details?id=${env.ANDROID_APP_ID}`

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('AccessibilityDeclarationMobileAndroid', () => {
  it('should render correctly', () => {
    render(<AccessibilityDeclarationMobileAndroid />)

    expect(screen).toMatchSnapshot()
  })

  it.each`
    url                                                    | title
    ${ANDROID_STORE_LINK}                                  | ${'l’application Android'}
    ${'https://formulaire.defenseurdesdroits.fr/'}         | ${'Défenseur des droits'}
    ${'https://www.defenseurdesdroits.fr/saisir/delegues'} | ${'Défenseur des droits dans votre région'}
  `('should open $url when $title is clicked', async ({ url, title }) => {
    render(<AccessibilityDeclarationMobileAndroid />)

    const link = screen.getByText(title)
    await user.press(link)

    expect(openURLSpy).toHaveBeenCalledWith(url, undefined, true)
  })
})
