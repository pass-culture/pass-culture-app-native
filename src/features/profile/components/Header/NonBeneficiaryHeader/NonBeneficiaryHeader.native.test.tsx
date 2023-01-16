import mockdate from 'mockdate'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { NextSubscriptionStepResponse, SubscriptionMessage } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useBeneficiaryValidationNavigation } from 'features/auth/helpers/useBeneficiaryValidationNavigation'
import { nextSubscriptionStepFixture as mockStep } from 'features/identityCheck/__mocks__/nextSubscriptionStepFixture'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
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

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

jest.mock('features/profile/api/useUpdateProfileMutation')
jest.mock('features/auth/helpers/useBeneficiaryValidationNavigation')

let mockNextSubscriptionStep: NextSubscriptionStepResponse = mockStep

const mockedSubscriptionMessage = {
  callToActionMessage: null,
  popOverIcon: 'FILE',
  updatedAt: '2021-10-25T13:24Z',
  userMessage: 'Dossier déposé, nous sommes en train de le traiter',
} as SubscriptionMessage

jest.mock('features/auth/api/useNextSubscriptionStep', () => ({
  useNextSubscriptionStep: jest.fn(() => ({
    data: mockNextSubscriptionStep,
  })),
}))

const today = '2021-03-30T00:00:00Z'
mockdate.set(new Date(today))

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

      const { getByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-03-30T00:00Z"
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
      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-03-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
        />
      )

      expect(queryByTestId('eligibility-banner-container')).toBeTruthy()
    })

    it.each`
      birthdate       | credit   | age
      ${'2006-03-29'} | ${'20'}  | ${15}
      ${'2005-03-29'} | ${'30'}  | ${16}
      ${'2004-03-29'} | ${'30'}  | ${17}
      ${'2003-03-29'} | ${'300'} | ${18}
    `(
      "should display a banner if the user has not finished the identification flow yet (user's age: $age)",
      ({ birthdate, credit }: { birthdate: string; credit: string }) => {
        mockUseAuthContext.mockReturnValueOnce({
          user: {
            birthDate: birthdate,
          },
        })

        const { queryByText } = render(
          <NonBeneficiaryHeader
            eligibilityStartDatetime="2021-03-30T00:00Z"
            eligibilityEndDatetime="2022-02-30T00:00Z"
          />
        )

        expect(queryByText('Débloque tes ' + credit + ' €')).toBeTruthy()
        expect(queryByText(' à dépenser sur l’application')).toBeTruthy()
      }
    )

    it('should not display eligibility banner if nextSubscriptionStep is null', () => {
      mockNextSubscriptionStep = {
        ...mockStep,
        nextSubscriptionStep: null,
      }

      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-03-30T00:00Z"
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
          eligibilityStartDatetime="2021-03-30T00:00Z"
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

      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-03-30T00:00Z"
          eligibilityEndDatetime="2022-02-30T00:00Z"
        />
      )

      expect(queryByTestId('subscription-message-badge')).toBeTruthy()
    })
  })

  describe('<YoungerBadge/>', () => {
    it('should render the younger badge for user under 18 years old', () => {
      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-03-31T00:00Z"
          eligibilityEndDatetime="2022-03-31T00:00Z"
        />
      )

      expect(queryByTestId('younger-badge')).toBeTruthy()
    })
  })

  describe('<React.Fragment />', () => {
    it('should not display banner or badge if the user is over 15 years old and not eligible to credit (no nextSubscriptionStep and no identityCheckPending)', () => {
      mockNextSubscriptionStep = {
        ...mockStep,
        nextSubscriptionStep: null,
        hasIdentityCheckPending: false,
      }

      const { queryByTestId } = render(
        <NonBeneficiaryHeader
          eligibilityStartDatetime="2021-01-30T00:00Z"
          eligibilityEndDatetime="2022-01-30T00:00Z"
        />
      )

      expect(queryByTestId('subscription-message-badge')).toBeNull()
      expect(queryByTestId('eligibility-banner')).toBeNull()
      expect(queryByTestId('identity-check-pending-badge')).toBeNull()
      expect(queryByTestId('younger-badge')).toBeNull()
    })
  })
})
