import { render } from '@testing-library/react-native'
import React from 'react'

import { Expense, ExpenseDomain } from 'api/gen/api'
import { ExpenseV2 } from 'features/profile/components/types'

import { BeneficiaryCeilings } from './BeneficiaryCeilings'

const expenses_v1: Array<Expense> = [
  { current: 100, domain: ExpenseDomain.All, limit: 200 },
  { current: 70, domain: ExpenseDomain.Digital, limit: 100 },
  { current: 0, domain: ExpenseDomain.Physical, limit: 200 },
]

const expenses_v2: Array<ExpenseV2> = [
  { current: 153, domain: ExpenseDomain.All, limit: 200 },
  { current: 30, domain: ExpenseDomain.Digital, limit: 100 },
]

describe('BeneficiaryCeilings', () => {
  it('should render properly with deposit version 1', () => {
    const { getAllByTestId, getByText } = render(
      <BeneficiaryCeilings depositVersion={1} expenses={expenses_v1} />
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
      <BeneficiaryCeilings depositVersion={2} expenses={expenses_v2} />
    )

    const progressBars = getAllByTestId('progress-bar')
    expect(progressBars.length).toBe(2)

    const ceilingQuestion = getByText('Pourquoi les biens numériques sont-ils limités ?')
    expect(ceilingQuestion).toBeTruthy()
  })
})
