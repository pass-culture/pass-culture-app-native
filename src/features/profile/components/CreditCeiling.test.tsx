import { render } from '@testing-library/react-native'
import React from 'react'

import { ExpenseDomain } from 'api/gen'

import { CreditCeiling } from './CreditCeiling'

describe('CreditCeiling', () => {
  it('should render properly', () => {
    const { toJSON } = render(
      <CreditCeiling amount={155} max={200} type={ExpenseDomain.Physical} depositVersion={1} />
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should not render when the max is negative', () => {
    const { toJSON } = render(
      <CreditCeiling amount={155} max={-1} type={ExpenseDomain.Physical} depositVersion={1} />
    )
    expect(toJSON()).toBeNull()
  })
})
