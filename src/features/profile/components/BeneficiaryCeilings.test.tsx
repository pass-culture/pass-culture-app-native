import { render } from '@testing-library/react-native'
import React from 'react'

import { Expense, ExpenseDomain } from 'api/gen/api'
import { ExpenseV2 } from 'features/profile/components/types'

import { BeneficiaryCeilings } from './BeneficiaryCeilings'

const expenses_v1: Array<Expense> = [
  { current: 100, domain: ExpenseDomain.All, limit: 500 },
  { current: 50, domain: ExpenseDomain.Digital, limit: 100 },
  { current: 50, domain: ExpenseDomain.Physical, limit: 200 },
]

const expenses_v2: Array<ExpenseV2> = [
  { current: 150, domain: ExpenseDomain.All, limit: 300 },
  { current: 100, domain: ExpenseDomain.Digital, limit: 200 },
]

describe('BeneficiaryCeilings', () => {
  it('should render properly with deposit version 1', () => {
    const { getAllByTestId, getByText } = render(
      <BeneficiaryCeilings depositVersion={1} expenses={expenses_v1} walletBalance={400} />
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
      <BeneficiaryCeilings depositVersion={2} expenses={expenses_v2} walletBalance={150} />
    )

    const progressBars = getAllByTestId('progress-bar')
    expect(progressBars.length).toBe(2)

    const ceilingQuestion = getByText('Pourquoi les biens numériques sont-ils limités ?')
    expect(ceilingQuestion).toBeTruthy()
  })
})
