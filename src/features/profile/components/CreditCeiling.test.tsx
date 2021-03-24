import { render } from '@testing-library/react-native'
import React from 'react'

import { ExpenseDomain } from 'api/gen'
import { ColorsEnum } from 'ui/theme'

import { CreditCeiling } from './CreditCeiling'

describe('CreditCeiling', () => {
  it('should render properly', () => {
    const { toJSON } = render(
      <CreditCeiling
        amount={155}
        initial={200}
        domain={ExpenseDomain.Physical}
        hasPhysicalCeiling={true}
      />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should not render when the limit is negative', () => {
    const { toJSON } = render(
      <CreditCeiling
        amount={155}
        initial={-1}
        domain={ExpenseDomain.Physical}
        hasPhysicalCeiling={true}
      />
    )
    expect(toJSON()).toBeNull()
  })

  it('should render grey progress bar if currentAmount = 0', () => {
    const { getByTestId } = render(
      <CreditCeiling
        amount={0}
        initial={200}
        domain={ExpenseDomain.Physical}
        hasPhysicalCeiling={true}
      />
    )
    const progressBar = getByTestId('progress-bar')
    expect(progressBar.props.backgroundColor).toBe(ColorsEnum.GREY_DARK)
  })
})
