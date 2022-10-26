import React from 'react'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { SetName } from 'features/identityCheck/pages/profile/SetName'
import { render } from 'tests/utils/web'

jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ ...mockState }),
}))
jest.mock('features/identityCheck/useIdentityCheckNavigation')

describe('<SetName/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SetName />)
    expect(renderAPI).toMatchSnapshot()
  })
})
