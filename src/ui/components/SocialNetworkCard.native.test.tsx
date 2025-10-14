import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent, waitFor } from 'tests/utils'

import { SocialNetworkCard } from './SocialNetworkCard'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('SocialNetworkCard', () => {
  it('should openUrl onClick and track analytics', async () => {
    const openUrl = jest
      .spyOn(NavigationHelpers, 'openUrl')
      .mockImplementation(jest.fn(() => Promise.resolve()))
    render(<SocialNetworkCard network="facebook" />)

    const button = screen.getByText('Facebook')
    await user.press(button)

    await waitFor(() => {
      expect(analytics.logClickSocialNetwork).toHaveBeenCalledWith('Facebook')
      expect(openUrl).toHaveBeenCalledTimes(1)
    })
  })

  it('should use Twitter in analytics when click on X', async () => {
    const openUrl = jest
      .spyOn(NavigationHelpers, 'openUrl')
      .mockImplementation(jest.fn(() => Promise.resolve()))
    render(<SocialNetworkCard network="x" />)

    const button = screen.getByText('X')
    await user.press(button)

    await waitFor(() => {
      expect(analytics.logClickSocialNetwork).toHaveBeenCalledWith('Twitter')
      expect(openUrl).toHaveBeenCalledTimes(1)
    })
  })
})
