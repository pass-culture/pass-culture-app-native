import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, userEvent, screen } from 'tests/utils'

import { PublicDisabilityServices } from './PublicDisabilityServices'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.useFakeTimers()
const user = userEvent.setup()

describe('<PublicDisabilityServices />', () => {
  it('should render correctly', () => {
    render(<PublicDisabilityServices />)

    expect(screen).toMatchSnapshot()
  })

  it.each`
    url                                            | name
    ${'https://accessibilite.numerique.gouv.fr/'}  | ${'AccesLibre'}
    ${'https://aidantsconnect.beta.gouv.fr/'}      | ${'Aidant connect'}
    ${'https://aides.beta.numerique.gouv.fr/'}     | ${'Aides simplifiées'}
    ${'https://www.monparcourshandicap.gouv.fr/'}  | ${'Mon parcours handicap'}
    ${'https://audiodescription.culture.gouv.fr/'} | ${'Portail de l’audiodescription'}
  `('should open $url when $name is clicked', async ({ url, name }) => {
    render(<PublicDisabilityServices />)

    const link = screen.getByText(name)
    await user.press(link)

    expect(openURLSpy).toHaveBeenCalledWith(url, undefined, true)
  })
})
