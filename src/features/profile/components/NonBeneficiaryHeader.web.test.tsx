import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { BeneficiaryValidationStep, GetIdCheckTokenResponse } from 'api/gen'
import { flushAllPromises, fireEvent, render } from 'tests/utils'

import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

jest.mock('features/auth/api', () => ({
  useGetIdCheckToken: jest.fn(
    () =>
      ({
        isLoading: false,
        data: { token: 'thisIsATokenForIdCheck' },
      } as UseQueryResult<GetIdCheckTokenResponse>)
  ),
  useDepositAmount: () => '300 €',
}))
jest.mock('features/auth/settings')

const mockData = {
  email: 'email2@domain.ext',
  firstName: 'Jean',
  isBeneficiary: false,
  nextBeneficiaryValidationStep: 'phone-validation',
}
jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    isLoading: false,
    data: mockData,
    refetch: jest.fn(() =>
      Promise.resolve({
        data: mockData,
      })
    ),
  })),
}))

describe('NonBeneficiaryHeader  ', () => {
  afterAll(() => mockdate.reset())

  it('should render the right body for user under 18 years old', () => {
    const today = '2021-01-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-01-31T00:00Z"
        eligibilityEndDatetime="2022-01-31T00:00Z"
        nextBeneficiaryValidationStep={null}
      />
    )

    getByTestId('younger-badge')
  })

  it('should render the right body for 18 years old users, call analytics and navigate to phone validation', async () => {
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        nextBeneficiaryValidationStep={BeneficiaryValidationStep.PhoneValidation}
      />
    )

    const banner = getByTestId('18-banner')
    fireEvent.click(banner)

    await flushAllPromises()
    expect(navigate).toBeCalledWith('SetPhoneNumber')
  })

  it('should render the right body for 18 years old users if user has not completed idcheck', async () => {
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        nextBeneficiaryValidationStep={BeneficiaryValidationStep.PhoneValidation}
      />
    )

    getByTestId('body-container-18')
  })
  it('should render the right body for 18 years old users if user has completed idcheck', async () => {
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId, queryByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        nextBeneficiaryValidationStep={null}
      />
    )

    getByTestId('body-container-18-idcheck-completed')
    const container = queryByTestId('body-container')
    expect(container).toBeNull()
  })

  it('should render the right body for 18 years old users if user has completed idcheck', async () => {
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { queryByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        nextBeneficiaryValidationStep={null}
      />
    )
    const container = queryByTestId('body-container')
    expect(container).toBeNull()
  })

  it('should render the right body for user above 18 years old', () => {
    const today = '2021-02-30T00:00:00'
    mockdate.set(new Date(today))
    const { queryByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2020-02-30T00:00Z"
        eligibilityEndDatetime="2021-02-30T00:00Z"
        nextBeneficiaryValidationStep={null}
      />
    )
    const container = queryByTestId('body-container')
    expect(container).toBeNull()
  })

  it('should display correct depositAmount', () => {
    const { queryByText } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        nextBeneficiaryValidationStep={BeneficiaryValidationStep.PhoneValidation}
      />
    )
    expect(queryByText(/Profite de 300€/)).toBeTruthy()
  })
})
