import { render } from '@testing-library/react-native'
import React from 'react'

import { ExpenseDomain } from 'api/gen'
import { ColorsEnum } from 'ui/theme'

import { CreditCeiling } from './CreditCeiling'

describe('CreditCeiling', () => {
  it('should render properly', () => {
    const { toJSON } = render(
      <CreditCeiling amount={155} limit={200} type={ExpenseDomain.Physical} depositVersion={1} />
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should not render when the limit is negative', () => {
    const { toJSON } = render(
      <CreditCeiling amount={155} limit={-1} type={ExpenseDomain.Physical} depositVersion={1} />
    )
    expect(toJSON()).toBeNull()
  })

  it('should render grey progress bar if currentAmount = 0', () => {
    const { getByTestId } = render(
      <CreditCeiling amount={0} limit={200} type={ExpenseDomain.Physical} depositVersion={1} />
    )
    const progressBar = getByTestId('progress-bar')
    expect(progressBar.props.backgroundColor).toBe(ColorsEnum.GREY_DARK)
  })
})
