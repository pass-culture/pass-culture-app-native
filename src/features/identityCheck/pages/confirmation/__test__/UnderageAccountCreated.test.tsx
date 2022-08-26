import React from 'react'

import { UnderageAccountCreated } from 'features/identityCheck/pages/confirmation/UnderageAccountCreated'
import { render } from 'tests/utils'

jest.mock('react-query')

let mockIsUserUnderageBeneficiary = true
jest.mock('features/profile/utils', () => {
  return {
    isUserUnderageBeneficiary: jest.fn(() => {
      return mockIsUserUnderageBeneficiary
    }),
  }
})

describe('<UnderageAccountCreated/>', () => {
  it('should render correctly for underage beneficiaries', () => {
    const renderAPI = render(<UnderageAccountCreated />)
    expect(renderAPI).toMatchSnapshot()
  })
  it('should render correctly for 18 year-old beneficiaries', () => {
    mockIsUserUnderageBeneficiary = false
    const renderAPI = render(<UnderageAccountCreated />)
    expect(renderAPI).toMatchSnapshot()
  })
})
