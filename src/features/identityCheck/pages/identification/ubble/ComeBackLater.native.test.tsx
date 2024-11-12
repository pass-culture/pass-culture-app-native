import React from 'react'

import { ComeBackLater } from 'features/identityCheck/pages/identification/ubble/ComeBackLater'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('ComeBackLater', () => {
  it('should render correctly', () => {
    render(<ComeBackLater />)

    expect(screen).toMatchSnapshot()
  })

  it("should navigate to the home page when the 'M'identifier' plus tard' button is pressed", async () => {
    render(<ComeBackLater />)

    const button = screen.getByText('M’identifier plus tard')

    fireEvent.press(button)

    await waitFor(() =>
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    )
  })

  it('should log screen view when the screen is mounted', async () => {
    render(<ComeBackLater />)

    await waitFor(() => expect(analytics.logScreenViewComeBackLater).toHaveBeenCalledTimes(1))
  })

  it('should send a batch event when the screen is mounted', async () => {
    render(<ComeBackLater />)

    await waitFor(() =>
      expect(BatchUser.trackEvent).toHaveBeenNthCalledWith(1, BatchEvent.screenViewComeBackLater)
    )
  })

  it("should log analytics when the 'M'identifier plus tard' button is pressed", async () => {
    render(<ComeBackLater />)

    const button = screen.getByText('M’identifier plus tard')
    fireEvent.press(button)

    await waitFor(() => expect(analytics.logComeBackLaterClicked).toHaveBeenCalledTimes(1))
  })
})
