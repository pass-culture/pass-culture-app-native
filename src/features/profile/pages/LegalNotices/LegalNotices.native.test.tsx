import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { render, screen, userEvent } from 'tests/utils'

import { LegalNotices } from './LegalNotices'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})
const user = userEvent.setup()
jest.useFakeTimers()

describe('LegalNotices', () => {
  it('should render correctly', async () => {
    render(<LegalNotices />)

    expect(screen).toMatchSnapshot()
  })

  it('should log HasClickedContactForm event when press "Contacter le support" button', async () => {
    render(<LegalNotices />)

    const contactSupportButton = screen.getByText('Contacter le support')

    await user.press(contactSupportButton)

    expect(analytics.logHasClickedContactForm).toHaveBeenNthCalledWith(1, 'LegalNotices')
  })

  it('should go to CGUs when the "Conditions Générales d’Utilisation" link is pressed', async () => {
    render(<LegalNotices />)
    const cguButton = screen.getByText('Conditions Générales d’Utilisation')

    await user.press(cguButton)

    expect(openUrl).toHaveBeenCalledWith(env.CGU_LINK, undefined, true)
  })

  it('should go to personal data page when the "Charte des données personnelles" link is pressed', async () => {
    render(<LegalNotices />)
    const personalDataButton = screen.getByText('Charte des données personnelles')

    await user.press(personalDataButton)

    expect(openUrl).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK, undefined, true)
  })

  it('should go to code of conduct page when the "Charte d’utilisation et de bonne conduite" link is pressed', async () => {
    render(<LegalNotices />)
    const codeOfConductButton = screen.getByText('Charte d’utilisation et de bonne conduite')

    await user.press(codeOfConductButton)

    expect(openUrl).toHaveBeenCalledWith(env.CODE_OF_CONDUCT_LINK, undefined, true)
  })
})
