import React from 'react'

import { ComeBackLater } from 'features/identityCheck/pages/identification/ubble/ComeBackLater'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useGoBack from 'features/navigation/useGoBack'
import { analytics } from 'libs/analytics'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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
