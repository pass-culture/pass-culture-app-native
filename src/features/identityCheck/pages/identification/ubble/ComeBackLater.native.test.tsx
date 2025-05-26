import React from 'react'

import { ComeBackLater } from 'features/identityCheck/pages/identification/ubble/ComeBackLater'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics/provider'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('ComeBackLater', () => {
  it('should render correctly', () => {
    render(<ComeBackLater />)

    expect(screen).toMatchSnapshot()
  })

  it("should navigate to the home page when the 'M'identifier' plus tard' button is pressed", async () => {
    render(<ComeBackLater />)

    await user.press(screen.getByText('M’identifier plus tard'))

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should send a batch event when the screen is mounted', async () => {
    render(<ComeBackLater />)

    await waitFor(() =>
      expect(BatchProfile.trackEvent).toHaveBeenNthCalledWith(1, BatchEvent.screenViewComeBackLater)
    )
  })

  it("should log analytics when the 'M'identifier plus tard' button is pressed", async () => {
    render(<ComeBackLater />)

    await user.press(screen.getByText('M’identifier plus tard'))

    expect(analytics.logComeBackLaterClicked).toHaveBeenCalledTimes(1)
  })
})
