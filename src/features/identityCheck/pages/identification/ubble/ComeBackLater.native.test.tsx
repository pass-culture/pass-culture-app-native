import React from 'react'

import { ComeBackLater } from 'features/identityCheck/pages/identification/ubble/ComeBackLater'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { amplitude } from 'libs/amplitude'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { fireEvent, render, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('ComeBackLater', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ComeBackLater />)
    expect(renderAPI).toMatchSnapshot()
  })

  it("should navigate to the home page when the 'M'identifier' plus tard' button is pressed", async () => {
    const comeBackLater = render(<ComeBackLater />)

    const button = comeBackLater.getByText('M’identifier plus tard')

    fireEvent.press(button)

    await waitFor(() =>
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    )
  })
  it('should send a amplitude event when the screen is mounted', async () => {
    render(<ComeBackLater />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_come_back_later')
    )
  })
  it('should send a batch event when the screen is mounted', async () => {
    render(<ComeBackLater />)

    await waitFor(() =>
      expect(BatchUser.trackEvent).toHaveBeenNthCalledWith(1, BatchEvent.screenViewComeBackLater)
    )
  })
  it("should send a amplitude event when the 'M'identifier plus tard' button is pressed", async () => {
    const { getByText } = render(<ComeBackLater />)
    // clear the amplitude log event mock to clear the first amplitude event screen_view_come_back_later
    ;(amplitude.logEvent as jest.Mock).mockClear()

    const button = getByText('M’identifier plus tard')
    fireEvent.press(button)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'come_back_later_clicked')
    )
  })
})
