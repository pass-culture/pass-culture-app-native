import React from 'react'

import { ExpenseDomain } from 'api/gen'
import { render } from 'tests/utils/web'

import { CreditCeiling } from './CreditCeiling'

describe('CreditCeiling', () => {
  it('should render properly', () => {
    const renderAPI = render(
      <CreditCeiling
        amount={155}
        initial={200}
        domain={ExpenseDomain.physical}
        hasPhysicalCeiling={true}
        isUserUnderageBeneficiary={false}
      />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should not render when the limit is negative', () => {
    const renderAPI = render(
      <CreditCeiling
        amount={155}
        initial={-1}
        domain={ExpenseDomain.physical}
        hasPhysicalCeiling={true}
        isUserUnderageBeneficiary={false}
      />
    )
    expect(renderAPI.container.innerText).toBe(undefined)
  })

  it('should render grey progress bar if currentAmount = 0', () => {
    const { getByTestId } = render(
      <CreditCeiling
        amount={0}
        initial={200}
        domain={ExpenseDomain.physical}
        hasPhysicalCeiling={true}
        isUserUnderageBeneficiary={false}
      />
    )
    const progressBar = getByTestId('progress-bar')
    expect(progressBar.style.backgroundColor).toBe('rgb(105, 106, 111)')
  })
})
