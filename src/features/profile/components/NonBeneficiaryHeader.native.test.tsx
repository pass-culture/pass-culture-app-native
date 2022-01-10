import mockdate from 'mockdate'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import {
  IdentityCheckMethod,
  NextSubscriptionStepResponse,
  SubscriptionMessage,
  SubscriptionStep,
} from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { useIsUserUnderage } from 'features/profile/utils'
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

const mockedUseIsUserUnderage = mocked(useIsUserUnderage, true)

jest.mock('features/auth/api', () => ({
  useDepositAmountsByAge: jest.fn(() => ({
    fifteenYearsOldDeposit: '20 €',
    sixteenYearsOldDeposit: '30 €',
    seventeenYearsOldDeposit: '30 €',
    eighteenYearsOldDeposit: '300 €',
  })),
}))
jest.mock('features/profile/utils')

jest.mock('features/auth/settings')
jest.mock('features/home/api')
jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')

let mockNextSubscriptionStep: NextSubscriptionStepResponse = {
  allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
  nextSubscriptionStep: SubscriptionStep['identity-check'],
  hasIdentityCheckPending: false,
}

const mockedSubscriptionMessage = {
  callToActionMessage: null,
  popOverIcon: 'FILE',
  updatedAt: '2021-10-25T13:24Z',
  userMessage: 'Dossier déposé, nous sommes en train de le traiter',
} as SubscriptionMessage

jest.mock('features/auth/signup/nextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))

describe('<NonBeneficiaryHeader/>', () => {
  afterAll(mockdate.reset)

  describe('<EligibilityBanner/>', () => {
    beforeEach(() => {
      mockNextSubscriptionStep = {
        allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
        nextSubscriptionStep: SubscriptionStep['identity-check'],
        hasIdentityCheckPending: false,
      }
    })
    it('should render the right banner for 18 years old users, call analytics and navigate to nextBeneficiaryValidationStep', async () => {
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

    it('should render the right banner for 18 years old users if user has not completed identity check', () => {
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

    it('should display correct depositAmount', () => {
      const { queryByText } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
          isEligibleForBeneficiaryUpgrade={true}
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
          isEligibleForBeneficiaryUpgrade={true}
        />
      )
      expect(queryByText(/Profite de 300€/)).toBeFalsy()
      expect(queryByText(/Profite de ton crédit/)).toBeTruthy()
    })

    it('should not display eligibility banner if nextSubscriptionStep is null', () => {
      mockNextSubscriptionStep = {
        allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
        nextSubscriptionStep: null,
        hasIdentityCheckPending: false,
      }
      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
          isEligibleForBeneficiaryUpgrade={true}
        />
      )
      expect(queryByTestId('eligibility-banner')).toBeFalsy()
    })
  })

  describe('<IdentityCheckPendingBadge/>', () => {
    it('should display identity check pending badge if hasIdentityCheckPending is true and SubscriptionStep is null', async () => {
      mockNextSubscriptionStep = {
        allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
        nextSubscriptionStep: null,
        hasIdentityCheckPending: true,
      }
      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
          isEligibleForBeneficiaryUpgrade={true}
        />
      )
      queryByTestId('identity-check-pending-badge')
      expect(queryByTestId('eligibility-banner')).toBeFalsy()
    })
  })

  describe('<SubscriptionMessageBadge/>', () => {
    it('should render the subscription message if hasIdentityCheckPendingis false and SubscriptionStep is null', () => {
      mockNextSubscriptionStep = {
        allowedIdentityCheckMethods: [IdentityCheckMethod.ubble],
        nextSubscriptionStep: null,
        hasIdentityCheckPending: false,
      }
      const { getByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
          isEligibleForBeneficiaryUpgrade={true}
          subscriptionMessage={mockedSubscriptionMessage}
        />
      )
      getByTestId('subscription-message-badge')
    })
  })

  describe('<YoungerBadge/>', () => {
    it('should render the younger badge for user under 18 years old', () => {
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
  })

  describe('<React.Fragment />', () => {
    it('should not display banner or badge if isEligibleForBeneficiaryUpgrade is false and user not under 18 years old', () => {
      const today = '2021-03-30T00:00:00Z'
      mockdate.set(new Date(today))
      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
          isEligibleForBeneficiaryUpgrade={false}
          subscriptionMessage={null}
        />
      )
      expect(queryByTestId('subscription-message-badge')).toBeFalsy()
      expect(queryByTestId('eligibility-banner')).toBeFalsy()
      expect(queryByTestId('identity-check-pending-badge')).toBeFalsy()
      expect(queryByTestId('younger-badge')).toBeFalsy()
    })
  })
})
