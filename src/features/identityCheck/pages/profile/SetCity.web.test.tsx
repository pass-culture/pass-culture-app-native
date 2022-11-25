import React from 'react'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetCity } from 'features/identityCheck/pages/profile/SetCity'
import { render } from 'tests/utils/web'

jest.mock('react-query')

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ dispatch: mockDispatch, ...mockState }),
}))

describe('<SetCity/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SetCity />)
    expect(renderAPI).toMatchSnapshot()
  })
})
