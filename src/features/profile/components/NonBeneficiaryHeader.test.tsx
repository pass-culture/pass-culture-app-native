import { render } from '@testing-library/react-native'
import mockdate from 'mockdate'
import React from 'react'

import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

describe('NonBeneficiaryHeader', () => {
  afterAll(() => mockdate.reset())

  it('should render the right body for user under 18 years old', () => {
    const today = '2021-01-30T00:00:00'
    const birthday = '2003-01-31T00:00:00'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader email="john@doe.com" dateOfBirth={birthday} />
    )

    getByTestId('younger-badge')
  })
  it('should render the right body for 18 years old users', () => {
    const today = '2021-02-30T00:00:00'
    const birthday = '2003-01-31T00:00:00'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader email="john@doe.com" dateOfBirth={birthday} />
    )

    getByTestId('18-view')
  })
  it('should render the right body for user above 18years old', () => {
    const today = '2021-02-30T00:00:00'
    const birthday = '2002-01-31T00:00:00'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader email="john@doe.com" dateOfBirth={birthday} />
    )
    const container = getByTestId('body-container')
    expect(container.props.children).toBeNull()
  })
})
