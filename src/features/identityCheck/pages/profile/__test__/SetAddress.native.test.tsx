import React from 'react'

import { SetAddress } from 'features/identityCheck/pages/profile/SetAddress'
import { render } from 'tests/utils'

jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: () => ({ dispatch: jest.fn() }),
}))

let mockidCheckAddressAutocompletion = false
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockidCheckAddressAutocompletion,
  })),
}))

describe('<SetAddress/>', () => {
  it('should render a different component when addressAutocompletion is true', () => {
    const renderAPI = render(<SetAddress />)
    mockidCheckAddressAutocompletion = true
    const renderAPIWithAddressAutocompletion = render(<SetAddress />)
    expect(renderAPI).not.toEqual(renderAPIWithAddressAutocompletion)
  })
})
