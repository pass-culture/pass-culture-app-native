import React from 'react'

import {
  domains_credit_underage,
  domains_credit_v1,
  domains_credit_v2,
} from 'features/profile/components/headers/fixtures/domainsCredit'
import { render } from 'tests/utils'

import { BeneficiaryCeilings } from './BeneficiaryCeilings'

describe('BeneficiaryCeilings', () => {
  it('should render properly with deposit version 1', () => {
    const { getAllByTestId, getByText } = render(
      <BeneficiaryCeilings domainsCredit={domains_credit_v1} isUserUnderageBeneficiary={false} />
    )

    const progressBars = getAllByTestId('animated-progress-bar')
    expect(progressBars.length).toBe(3)

    const ceilingQuestion = getByText(
      'Pourquoi les biens physiques et numériques sont-ils limités\u00a0?'
    )
    expect(ceilingQuestion).toBeTruthy()
  })

  it('should render properly with deposit version 2', () => {
    const { getAllByTestId, getByText } = render(
      <BeneficiaryCeilings domainsCredit={domains_credit_v2} isUserUnderageBeneficiary={false} />
    )

    const progressBars = getAllByTestId('animated-progress-bar')
    expect(progressBars.length).toBe(2)

    const ceilingQuestion = getByText('Pourquoi les biens numériques sont-ils limités\u00a0?')
    expect(ceilingQuestion).toBeTruthy()
  })

  it('should render properly with underage deposit version', () => {
    const { getAllByTestId, queryByText } = render(
      <BeneficiaryCeilings
        domainsCredit={domains_credit_underage}
        isUserUnderageBeneficiary={true}
      />
    )

    const progressBars = getAllByTestId('animated-progress-bar')
    expect(progressBars.length).toBe(1)

    const ceilingQuestion = queryByText('Pourquoi les biens numériques sont-ils limités\u00a0?')
    expect(ceilingQuestion).toBe(null)
  })
})
