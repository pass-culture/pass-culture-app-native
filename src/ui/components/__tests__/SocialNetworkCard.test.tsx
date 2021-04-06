import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { SocialNetworkCard } from '../SocialNetworkCard'

describe('SocialNetworkCard', () => {
  it('should openExternalUrl onClick and track analytics', () => {
    const openExternalUrl = jest
      .spyOn(NavigationHelpers, 'openExternalUrl')
      .mockImplementation(jest.fn())
    const { getByText } = render(<SocialNetworkCard network="twitter" />)
    const button = getByText('Twitter')
    fireEvent.press(button)
    expect(analytics.logClickSocialNetwork).toBeCalledWith('Twitter')
    expect(openExternalUrl).toBeCalled()
  })
})
