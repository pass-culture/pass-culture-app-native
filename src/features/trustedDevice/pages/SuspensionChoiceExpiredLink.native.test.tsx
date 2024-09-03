import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { SuspensionChoiceExpiredLink } from 'features/trustedDevice/pages/SuspensionChoiceExpiredLink'
import { env } from 'libs/environment'
import { render, screen, fireEvent } from 'tests/utils'

const mockOpenUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<SuspensionChoiceExpiredLink/>', () => {
  it('should match snapshot', () => {
    render(<SuspensionChoiceExpiredLink />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page when "Retourner à l’accueil" button is clicked', () => {
    render(<SuspensionChoiceExpiredLink />)

    const goHomeButton = screen.getByText('Retourner à l’accueil')
    fireEvent.press(goHomeButton)

    expect(navigate).toHaveBeenNthCalledWith(
      1,
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should open mail app when "Contacter le service fraude" button is clicked', async () => {
    render(<SuspensionChoiceExpiredLink />)

    const contactFraudButton = screen.getByText('Contacter le service fraude')
    fireEvent.press(contactFraudButton)

    expect(mockOpenUrl).toHaveBeenNthCalledWith(
      1,
      `mailto:${env.FRAUD_EMAIL_ADDRESS}`,
      undefined,
      true
    )
  })
})
