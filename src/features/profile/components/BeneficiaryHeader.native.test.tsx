import React from 'react'

import {
  domains_credit_v1,
  domains_credit_v2,
} from 'features/profile/components/headers/fixtures/domainsCredit'
import { render } from 'tests/utils'

import { BeneficiaryHeader } from './BeneficiaryHeader'

jest.mock('features/profile/api')

describe('BeneficiaryHeader', () => {
  it('should render properly with deposit version 1', () => {
    const { getAllByTestId } = render(
      <BeneficiaryHeader
        domainsCredit={domains_credit_v1}
        firstName={'Rosa'}
        lastName={'Bonheur'}
      />
    )

    const progressBars = getAllByTestId('animated-progress-bar')
    expect(progressBars.length).toBe(3)
  })

  it('should render properly with deposit version 2', () => {
    const { getAllByTestId } = render(
      <BeneficiaryHeader
        domainsCredit={domains_credit_v2}
        firstName={'Rosa'}
        lastName={'Bonheur'}
      />
    )

    const progressBars = getAllByTestId('animated-progress-bar')
    expect(progressBars.length).toBe(2)
  })
})
