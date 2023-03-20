import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils'

import { SocialNetworkCard } from '../SocialNetworkCard'

describe('SocialNetworkCard', () => {
  it('should openUrl onClick and track analytics', async () => {
    const openUrl = jest
      .spyOn(NavigationHelpers, 'openUrl')
      .mockImplementation(jest.fn(() => Promise.resolve()))
    render(<SocialNetworkCard network="twitter" />)

    const button = screen.getByText('Twitter')
    fireEvent.press(button)

    await waitFor(() => {
      expect(analytics.logClickSocialNetwork).toBeCalledWith('Twitter')
      expect(openUrl).toHaveBeenCalledTimes(1)
    })
  })
})
