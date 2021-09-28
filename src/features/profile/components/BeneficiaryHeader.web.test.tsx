import React from 'react'

import { render } from 'tests/utils'

import { BeneficiaryHeader } from './BeneficiaryHeader'

const domains_credit_v1 = {
  all: { initial: 50000, remaining: 40000 },
  physical: { initial: 30000, remaining: 10000 },
  digital: { initial: 30000, remaining: 20000 },
}

const domains_credit_v2 = {
  all: { initial: 30000, remaining: 10000 },
  digital: { initial: 20000, remaining: 5000 },
}

jest.mock('features/home/api')

describe('BeneficiaryHeader', () => {
  it('should render properly with deposit version 1', () => {
    const { getAllByTestId } = render(
      <BeneficiaryHeader
        domainsCredit={domains_credit_v1}
        firstName={'Rosa'}
        lastName={'Bonheur'}
      />
    )

    const progressBars = getAllByTestId('progress-bar')
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

    const progressBars = getAllByTestId('progress-bar')
    expect(progressBars.length).toBe(2)
  })
})
