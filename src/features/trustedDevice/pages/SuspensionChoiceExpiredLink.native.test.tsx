import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { env } from 'libs/environment/env'
import { render, screen, userEvent } from 'tests/utils'

const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<SuspensionChoiceExpiredLink/>', () => {
  it('should match snapshot', () => {
    render(<SuspensionChoiceExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page when "Retourner à l’accueil" button is clicked', async () => {
    render(<SuspensionChoiceExpiredLink />)

    const goHomeButton = screen.getByText('Retourner à l’accueil')
    await user.press(goHomeButton)

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should open mail app when "Contacter le service fraude" button is clicked', async () => {
    render(<SuspensionChoiceExpiredLink />)

    const contactFraudButton = screen.getByText('Contacter le service fraude')
    await user.press(contactFraudButton)

    expect(mockOpenUrl).toHaveBeenNthCalledWith(
      1,
      `mailto:${env.FRAUD_EMAIL_ADDRESS}`,
      undefined,
      true
    )
  })
})
