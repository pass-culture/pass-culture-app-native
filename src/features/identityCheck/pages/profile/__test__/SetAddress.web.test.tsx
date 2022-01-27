import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { render } from 'tests/utils/web'

jest.mock('react-query')

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: () => ({ dispatch: mockDispatch, ...mockState }),
}))

describe('<SetAddress/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<SetAddress />)
    expect(renderAPI).toMatchSnapshot()
  })
})
