import React from 'react'
import waitForExpect from 'wait-for-expect'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render } from 'tests/utils'

import { SocialNetworkCard } from '../SocialNetworkCard'

describe('SocialNetworkCard', () => {
  it('should openUrl onClick and track analytics', async () => {
    const openUrl = jest
      .spyOn(NavigationHelpers, 'openUrl')
      .mockImplementation(jest.fn(() => Promise.resolve()))
    const { getByText } = render(<SocialNetworkCard network="twitter" />)
    const button = getByText('Twitter')
    fireEvent.press(button)
    await waitForExpect(() => {
      expect(analytics.logClickSocialNetwork).toBeCalledWith('Twitter'),
        expect(openUrl).toHaveBeenCalledTimes(1)
    })
  })
})
