import React from 'react'

import { ComeBackLater } from 'features/identityCheck/pages/identification/identificationStart/ComeBackLater'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { amplitude } from 'libs/amplitude'
import { fireEvent, render, waitFor } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('ComeBackLater', () => {
  it('should render correctly', () => {
    const renderAPI = render(<ComeBackLater />)
    expect(renderAPI).toMatchSnapshot()
  })

  it("should navigate to the home page when the 'M'identifier' plus tard' button is pressed", () => {
    const comeBackLater = render(<ComeBackLater />)

    const button = comeBackLater.getByText('M’identifier plus tard')

    fireEvent.press(button)

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
  it('should send a amplitude event when the screen is mounted', async () => {
    render(<ComeBackLater />)

    await waitFor(() =>
      expect(amplitude.logEvent).toHaveBeenNthCalledWith(1, 'screen_view_come_back_later')
    )
  })
})
