import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'

import { FeedbackInAppButton } from './FeedbackInAppButton'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('FeedbackInAppButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate when "Faire une suggestion" button is clicked', async () => {
    render(<FeedbackInAppButton />)

    const legalNoticesButton = screen.getByText('Faire une suggestion')
    await user.press(legalNoticesButton)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'FeedbackInApp',
    })
  })
})
