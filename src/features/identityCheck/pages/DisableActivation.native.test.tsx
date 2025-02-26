import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { DisableActivation } from 'features/identityCheck/pages/DisableActivation'
import * as OpenUrlAPI from 'features/navigation/helpers/openUrl'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/fixtures'
import { render, screen, userEvent } from 'tests/utils'

const openUrl = jest.spyOn(OpenUrlAPI, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')
jest.useFakeTimers()

describe('<DisableActivation/>', () => {
  it('should render correctly', () => {
    render(<DisableActivation />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to Home when clicking on "Retourner à l’accueil" button', async () => {
    render(<DisableActivation />)

    const goHomeButton = screen.getByText('Retourner à l’accueil')
    await userEvent.press(goHomeButton)

    expect(navigate).toHaveBeenCalledWith(homeNavConfig[0], homeNavConfig[1])
  })

  it('should open FAQ link when pressing "Plus d’infos dans notre FAQ"', async () => {
    render(<DisableActivation />)

    const faqButton = screen.getByText('Plus d’infos dans notre FAQ')
    await userEvent.press(faqButton)

    expect(openUrl).toHaveBeenNthCalledWith(1, env.FAQ_LINK_CREDIT_V3, undefined, true)
  })

  it('should log analytics when pressing "Plus d’infos dans notre FAQ"', async () => {
    render(<DisableActivation />)

    const faqButton = screen.getByText('Plus d’infos dans notre FAQ')
    await userEvent.press(faqButton)

    expect(analytics.logHasClickedTutorialFAQ).toHaveBeenCalledTimes(1)
  })
})
