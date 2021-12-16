import mockdate from 'mockdate'
import { rest } from 'msw'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { IdentityCheckMethod, NextSubscriptionStepResponse, SubscriptionStep } from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { useIsUserUnderage } from 'features/profile/utils'
import { env } from 'libs/environment'
import { server } from 'tests/server'
import { render, fireEvent } from 'tests/utils'

import { NonBeneficiaryHeader } from './NonBeneficiaryHeader'

jest.mock('react-query')

const mockedNavigate = jest.fn()
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native')
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }
})

jest.mock('features/profile/utils')
const mockedUseIsUserUnderage = mocked(useIsUserUnderage, true)

jest.mock('features/auth/api', () => ({
  useDepositAmountsByAge: jest.fn(() => ({
    fifteenYearsOldDeposit: '20 €',
    sixteenYearsOldDeposit: '30 €',
    seventeenYearsOldDeposit: '30 €',
    eighteenYearsOldDeposit: '300 €',
  })),
}))
jest.mock('features/auth/settings')
jest.mock('features/home/api')
jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')

jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: () => ({ identification: { processing: false } }),
}))

const allowedIdentityCheckMethods = [IdentityCheckMethod.Ubble]

describe('NonBeneficiaryHeader  ', () => {
  afterAll(mockdate.reset)

  it('should render the right body for user under 18 years old', () => {
    const today = '2021-01-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-01-31T00:00Z"
        eligibilityEndDatetime="2022-01-31T00:00Z"
        isEligibleForBeneficiaryUpgrade={false}
      />
    )

    getByTestId('younger-badge')
  })

  it('should render the right body for 18 years old users, call analytics and navigate to nextBeneficiaryValidationStep', async () => {
    mockSubscriptionStepResponse({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep.ProfileCompletion,
      hasIdentityCheckPending: false,
    })

    const setError = jest.fn()
    const {
      navigateToNextBeneficiaryValidationStep: mockedNavigateToNextBeneficiaryValidationStep,
    } = useBeneficiaryValidationNavigation(setError)

    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        isEligibleForBeneficiaryUpgrade={true}
      />
    )

    const banner = getByTestId('eligibility-banner')
    fireEvent.press(banner)

    await waitForExpect(() => {
      expect(mockedNavigateToNextBeneficiaryValidationStep).toHaveBeenCalled()
    })
  })

  it('should render the right body for 18 years old users if user has not completed idcheck', async () => {
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        isEligibleForBeneficiaryUpgrade={true}
      />
    )

    getByTestId('eligibility-banner-container')
  })

  it('should navigate to SelectSchoolHome for 15-17 years old users if user has not completed idcheck', async () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { getByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        isEligibleForBeneficiaryUpgrade={true}
      />
    )

    const banner = getByTestId('eligibility-banner')
    fireEvent.press(banner)

    await waitForExpect(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('SelectSchoolHome')
    })
  })

  it('should render the right body for 18 years old users if user has completed idcheck', async () => {
    const today = '2021-02-30T00:00:00Z'
    mockdate.set(new Date(today))
    const { queryByTestId } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        isEligibleForBeneficiaryUpgrade={true}
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
        isEligibleForBeneficiaryUpgrade={true}
      />
    )
    const container = queryByTestId('body-container')
    expect(container).toBeNull()
  })

  it('should display correct depositAmount', async () => {
    mockSubscriptionStepResponse({
      allowedIdentityCheckMethods,
      nextSubscriptionStep: SubscriptionStep.ProfileCompletion,
      hasIdentityCheckPending: false,
    })
    const { queryByText } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        isEligibleForBeneficiaryUpgrade={true}
      />
    )
    await waitForExpect(() => {
      expect(queryByText(/Profite de 300€/)).toBeTruthy()
    })
  })

  it('should display correct credit message for underage', () => {
    mockedUseIsUserUnderage.mockReturnValueOnce(true)
    const { queryByText } = render(
      <NonBeneficiaryHeader
        eligibilityStartDatetime="2021-02-30T00:00Z"
        eligibilityEndDatetime="2022-02-30T00:00Z"
        isEligibleForBeneficiaryUpgrade={true}
      />
    )
    expect(queryByText(/Profite de 300€/)).toBeFalsy()
    expect(queryByText(/Profite de ton crédit/)).toBeTruthy()
  })
})

function mockSubscriptionStepResponse(nextSubscription: NextSubscriptionStepResponse) {
  return server.use(
    rest.get<NextSubscriptionStepResponse>(
      env.API_BASE_URL + `/native/v1/subscription/next_step`,
      (_req, res, ctx) => res.once(ctx.status(200), ctx.json(nextSubscription))
    )
  )
}
