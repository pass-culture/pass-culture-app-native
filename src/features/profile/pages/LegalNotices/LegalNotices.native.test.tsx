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

  it('should navigate when the cgu row is clicked', async () => {
    render(<LegalNotices />)

    const row = screen.getByText('Conditions Générales d’Utilisation')
    await user.press(row)

    expect(openUrl).toHaveBeenCalledWith(env.CGU_LINK, undefined, true)
  })

  it('should navigate when the data-privacy-chart row is clicked', async () => {
    render(<LegalNotices />)

    const row = screen.getByText('Charte de protection des données personnelles')
    await user.press(row)

    expect(openUrl).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK, undefined, true)
  })

  it('should log HasClickedContactForm event when press "Contacter le support" button', async () => {
    render(<LegalNotices />)

    const contactSupportButton = screen.getByText('Contacter le support')

    await userEvent.press(contactSupportButton)

    expect(analytics.logHasClickedContactForm).toHaveBeenNthCalledWith(1, 'LegalNotices')
  })
})
