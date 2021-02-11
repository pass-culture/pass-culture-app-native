import { render } from '@testing-library/react-native'
import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { GetIdCheckTokenResponse } from 'api/gen'

import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

jest.mock('features/auth/api', () => ({
  useGetIdCheckToken: jest.fn(
    () =>
      ({
        isLoading: false,
        data: { token: 'thisIsATokenForIdCheck' },
      } as UseQueryResult<GetIdCheckTokenResponse>)
  ),
}))

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

    getByTestId('body-container-18')

    const banner = getByTestId('18-banner')
    banner.props.onClick()

    expect(navigate).toBeCalledWith('IdCheck', {
      email: 'john@doe.com',
      licenceToken: 'thisIsATokenForIdCheck',
    })
  })
  it('should render the right body for user above 18 years old', () => {
    const today = '2021-02-30T00:00:00'
    const birthday = '2002-01-31T00:00:00'
    mockdate.set(new Date(today))
    const { queryByTestId } = render(
      <NonBeneficiaryHeader email="john@doe.com" dateOfBirth={birthday} />
    )
    const container = queryByTestId('body-container')
    expect(container).toBeNull()
  })
})
