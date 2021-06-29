import React from 'react'

import { render } from 'tests/utils'

import { BeneficiaryCeilings } from './BeneficiaryCeilings'

const domains_credit_v1 = {
  all: { initial: 50000, remaining: 40000 },
  physical: { initial: 30000, remaining: 10000 },
  digital: { initial: 30000, remaining: 20000 },
}

const domains_credit_v2 = {
  all: { initial: 30000, remaining: 10000 },
  digital: { initial: 20000, remaining: 5000 },
}

describe('BeneficiaryCeilings', () => {
  it('should render properly with deposit version 1', () => {
    const { getAllByTestId, getByText } = render(
      <BeneficiaryCeilings domainsCredit={domains_credit_v1} />
    )

    const progressBars = getAllByTestId('progress-bar')
    expect(progressBars.length).toBe(3)

    const ceilingQuestion = getByText(
      'Pourquoi les biens physiques et numériques sont-ils limités ?'
    )
    expect(ceilingQuestion).toBeTruthy()
  })

  it('should render properly with deposit version 2', () => {
    const { getAllByTestId, getByText } = render(
      <BeneficiaryCeilings domainsCredit={domains_credit_v2} />
    )

    const progressBars = getAllByTestId('progress-bar')
    expect(progressBars.length).toBe(2)

    const ceilingQuestion = getByText('Pourquoi les biens numériques sont-ils limités ?')
    expect(ceilingQuestion).toBeTruthy()
  })
})
