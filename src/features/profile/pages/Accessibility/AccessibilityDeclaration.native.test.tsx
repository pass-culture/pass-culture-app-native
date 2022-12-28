import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityDeclaration } from 'features/profile/pages/Accessibility/AccessibilityDeclaration'
import { render, fireEvent } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AccessibilityDeclaration', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AccessibilityDeclaration />)
    expect(renderAPI).toMatchSnapshot()
  })

  it.each`
    url                                                    | title
    ${'https://formulaire.defenseurdesdroits.fr/'}         | ${'Défenseur des droits'}
    ${'https://www.defenseurdesdroits.fr/saisir/delegues'} | ${'Défenseur des droits dans votre région'}
  `('should open $url when $title is clicked', ({ url, title }) => {
    const { getByText } = render(<AccessibilityDeclaration />)

    const link = getByText(title)
    fireEvent.press(link)

    expect(openURLSpy).toHaveBeenCalledWith(url, undefined, true)
  })
})
