import mockdate from 'mockdate'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { NextSubscriptionStepResponse, SubscriptionMessage } from 'api/gen'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/__mocks__/nextSubscriptionStepFixture'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { useIsUserUnderage } from 'features/profile/utils'
import { fireEvent, render } from 'tests/utils'

jest.mock('react-query')

const mockedNavigate = jest.fn()
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native')
  return {
    ...actualNav,
    useNavigation: () => ({ navigate: mockedNavigate }),
    useFocusEffect: jest.fn(),
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
jest.mock('features/profile/api')
jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')

let mockNextSubscriptionStep: NextSubscriptionStepResponse = mockStep

const mockedSubscriptionMessage = {
  callToActionMessage: null,
  popOverIcon: 'FILE',
  updatedAt: '2021-10-25T13:24Z',
  userMessage: 'Dossier déposé, nous sommes en train de le traiter',
} as SubscriptionMessage

jest.mock('features/auth/signup/useNextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))

describe('<NonBeneficiaryHeader/>', () => {
  afterAll(mockdate.reset)

  describe('<EligibilityBanner/>', () => {
    beforeEach(() => {
      mockNextSubscriptionStep = mockStep
    })
    it('should render the right banner for 18 years old users, call analytics and navigate to nextBeneficiaryValidationStep', async () => {
      const setError = jest.fn()
      const { nextBeneficiaryValidationStepNavConfig } =
        useBeneficiaryValidationNavigation(setError)

      const today = '2021-02-30T00:00:00Z'
      mockdate.set(new Date(today))

      const { getByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
        />
      )

      const banner = getByTestId('eligibility-banner')
      fireEvent.press(banner)

      await waitForExpect(() => {
        expect(mockedNavigate).toHaveBeenCalledWith(
          nextBeneficiaryValidationStepNavConfig?.screen,
          nextBeneficiaryValidationStepNavConfig?.params
        )
      })
    })

    it('should render the right banner for 18 years old users if user has not completed identity check', () => {
      const today = '2021-02-30T00:00:00Z'
      mockdate.set(new Date(today))

      const { getByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
        />
      )

      getByTestId('eligibility-banner-container')
    })

    it('should display correct depositAmount', () => {
      const { queryByText } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
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
        />
      )

      expect(queryByText(/Profite de 300€/)).toBeNull()
      expect(queryByText(/Profite de ton crédit/)).toBeTruthy()
    })

    it('should not display eligibility banner if nextSubscriptionStep is null', () => {
      mockNextSubscriptionStep = {
        ...mockStep,
        nextSubscriptionStep: null,
      }

      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
        />
      )

      expect(queryByTestId('eligibility-banner')).toBeNull()
    })
  })

  describe('<IdentityCheckPendingBadge/>', () => {
    it('should display identity check pending badge if hasIdentityCheckPending is true', async () => {
      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
        />
      )

      queryByTestId('identity-check-pending-badge')

      expect(queryByTestId('eligibility-banner')).toBeNull()
    })
  })

  describe('<SubscriptionMessageBadge/>', () => {
    it('should render the subscription message if there is one', () => {
      mockNextSubscriptionStep = {
        ...mockStep,
        subscriptionMessage: mockedSubscriptionMessage,
      }

      const { getByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
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
        />
      )

      getByTestId('younger-badge')
    })
  })

  describe('<React.Fragment />', () => {
    it('should not display banner or badge if the user is over 15 years old and not eligible to credit (no nextSubscriptionStep and no identityCheckPending)', () => {
      const today = '2021-03-30T00:00:00Z'
      mockdate.set(new Date(today))
      mockNextSubscriptionStep = {
        ...mockStep,
        nextSubscriptionStep: null,
        hasIdentityCheckPending: false,
      }

      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-02-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
        />
      )

      expect(queryByTestId('subscription-message-badge')).toBeNull()
      expect(queryByTestId('eligibility-banner')).toBeNull()
      expect(queryByTestId('identity-check-pending-badge')).toBeNull()
      expect(queryByTestId('younger-badge')).toBeNull()
    })
  })
})
