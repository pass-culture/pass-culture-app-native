import React from 'react'

import { BeneficiaryAccountCreated } from 'features/identityCheck/pages/confirmation/BeneficiaryAccountCreated'
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

describe('<BeneficiaryAccountCreated/>', () => {
  it('should render correctly for underage beneficiaries', () => {
    const renderAPI = render(<BeneficiaryAccountCreated />)
    expect(renderAPI).toMatchSnapshot()
  })
  it('should render correctly for 18 year-old beneficiaries', () => {
    mockIsUserUnderageBeneficiary = false
    const renderAPI = render(<BeneficiaryAccountCreated />)
    expect(renderAPI).toMatchSnapshot()
  })
})
