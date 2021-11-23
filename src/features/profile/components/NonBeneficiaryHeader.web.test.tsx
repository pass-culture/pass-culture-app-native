import mockdate from 'mockdate'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import { BeneficiaryValidationStep } from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { useIsUserUnderage } from 'features/profile/utils'
import { flushAllPromises, render, fireEvent } from 'tests/utils/web'

import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

const mockedNavigate = jest.fn()
jest.mock('@react-navigation/core', () => {
  const actualNav = jest.requireActual('@react-navigation/core')
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }
})

jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')
// eslint-disable-next-line react-hooks/rules-of-hooks
const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()

jest.mock('features/profile/utils')
const mockedUseIsUserUnderage = mocked(useIsUserUnderage, true)

jest.mock('features/auth/api', () => ({ useDepositAmount: () => '300 €' }))
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
  afterAll(mockdate.reset)

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

    const banner = getByTestId('eligibility-banner')
    fireEvent.click(banner)

    await flushAllPromises()
    expect(navigateToNextBeneficiaryValidationStep).toBeCalledWith({
      nextBeneficiaryValidationStep: BeneficiaryValidationStep.PhoneValidation,
    })
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

  it('should navigate to SelectSchoolHome for 15-17 years old users if user has not completed idcheck', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        nextBeneficiaryValidationStep={BeneficiaryValidationStep.PhoneValidation}
      />
    )

    const banner = getByTestId('eligibility-banner')
    fireEvent.click(banner)

    await flushAllPromises()
    expect(mockedNavigate).toBeCalledWith('SelectSchoolHome', {
      nextBeneficiaryValidationStep: BeneficiaryValidationStep.PhoneValidation,
    })
  })

  // FIXME: find how to suppress warnings:
  //  1. Use PascalCase for React components, or lowercase for HTML elements.%s", "matchSubscriptionMessageIconToSvg"
  //  2. If you meant to render a React component, start its name with an uppercase letter.%s", "matchSubscriptionMessageIconToSvg"
  it.skip('should render the right body for 18 years old users if user has completed idcheck', async () => {
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
  it('should display correct credit message for underage', () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    const { queryByText } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        nextBeneficiaryValidationStep={BeneficiaryValidationStep.PhoneValidation}
      />
    )
    expect(queryByText(/Profite de 300€/)).toBeFalsy()
    expect(queryByText(/Profite de ton crédit/)).toBeTruthy()
  })
  it('should display correct credit message for underage with no next step available', () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    const { queryByText } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        nextBeneficiaryValidationStep={null}
      />
    )
    expect(queryByText(/Profite de 300€/)).toBeFalsy()
    expect(queryByText(/Profite de ton crédit/)).toBeTruthy()
  })
})
