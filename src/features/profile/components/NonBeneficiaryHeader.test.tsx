import { render } from '@testing-library/react-native'
import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { GetIdCheckTokenResponse } from 'api/gen'
import { analytics } from 'libs/analytics'

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
    const today = '2021-01-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        email="john@doe.com"
        eligibilityStartDatetime="2021-01-31T00:00Z"
        eligibilityEndDatetime="2022-01-31T00:00Z"
      />
    )

    getByTestId('younger-badge')
  })
  it('should render the right body for 18 years old users and call analytics', () => {
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        email="john@doe.com"
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
      />
    )

    getByTestId('body-container-18')

    const banner = getByTestId('18-banner')
    banner.props.onClick()

    expect(analytics.logIdCheck).toBeCalledWith('Profile')
    expect(navigate).toBeCalledWith('IdCheck', {
      email: 'john@doe.com',
      licenceToken: 'thisIsATokenForIdCheck',
    })
  })
  it('should render the right body for user above 18 years old', () => {
    const today = '2021-02-30T00:00:00'
    mockdate.set(new Date(today))
    const { queryByTestId } = render(
      <NonBeneficiaryHeader
        email="john@doe.com"
        eligibilityStartDatetime="2020-02-30T00:00Z"
        eligibilityEndDatetime="2021-02-30T00:00Z"
      />
    )
    const container = queryByTestId('body-container')
    expect(container).toBeNull()
  })
})
