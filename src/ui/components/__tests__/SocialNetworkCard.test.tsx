import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { SocialNetworkCard } from '../SocialNetworkCard'

describe('SocialNetworkCard', () => {
  it('should openUrl onClick and track analytics', () => {
    const openUrl = jest.spyOn(NavigationHelpers, 'openUrl').mockImplementation(jest.fn())
    const { getByText } = render(<SocialNetworkCard network="twitter" />)
    const button = getByText('Twitter')
    fireEvent.press(button)
    expect(analytics.logClickSocialNetwork).toBeCalledWith('Twitter')
    expect(openUrl).toBeCalled()
  })
})
