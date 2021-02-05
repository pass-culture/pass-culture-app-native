import { render } from '@testing-library/react-native'
import React from 'react'

import { Expense, ExpenseDomain } from 'api/gen/api'
import { ExpenseV2 } from 'features/profile/components/types'

import { BeneficiaryHeader } from './BeneficiaryHeader'

const expenses_v1: Array<Expense> = [
  { current: 100, domain: ExpenseDomain.All, limit: 200 },
  { current: 70, domain: ExpenseDomain.Digital, limit: 100 },
  { current: 0, domain: ExpenseDomain.Physical, limit: 200 },
]

const expenses_v2: Array<ExpenseV2> = [
  { current: 153, domain: ExpenseDomain.All, limit: 200 },
  { current: 30, domain: ExpenseDomain.Digital, limit: 100 },
]

describe('BeneficiaryHeader', () => {
  it('should render properly with deposit version 1', () => {
    const { getAllByTestId } = render(
      <BeneficiaryHeader
        depositVersion={1}
        expenses={expenses_v1}
        firstName={'Rosa'}
        lastName={'Bonheur'}
        remainingCredit={150}
      />
    )

    const progressBars = getAllByTestId('progress-bar')
    expect(progressBars.length).toBe(3)
  })

  it('should render properly with deposit version 2', () => {
    const { getAllByTestId } = render(
      <BeneficiaryHeader
        depositVersion={2}
        expenses={expenses_v2}
        firstName={'Rosa'}
        lastName={'Bonheur'}
        remainingCredit={150}
      />
    )

    const progressBars = getAllByTestId('progress-bar')
    expect(progressBars.length).toBe(2)
  })
})
