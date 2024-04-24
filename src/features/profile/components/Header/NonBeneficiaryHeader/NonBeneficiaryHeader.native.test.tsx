import mockdate from 'mockdate'
import React from 'react'

import {
  BannerName,
  BannerResponse,
  SubscriptionMessage,
  SubscriptionStepperResponseV2,
} from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { subscriptionStepperFixture as mockStep } from 'features/identityCheck/fixtures/subscriptionStepperFixture'
import { NonBeneficiaryHeader } from 'features/profile/components/Header/NonBeneficiaryHeader/NonBeneficiaryHeader'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.Mock

jest.mock('features/profile/api/useUpdateProfileMutation')

const mockedSubscriptionMessage = {
  popOverIcon: 'FILE',
  updatedAt: '2021-10-25T13:24Z',
  userMessage: 'Dossier déposé, nous sommes en train de le traiter',
} as SubscriptionMessage

mockUseAuthContext.mockReturnValue({
  isLoggedIn: true,
  isUserLoading: false,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
})

const today = '2021-03-30T00:00:00Z'
mockdate.set(new Date(today))

describe('<NonBeneficiaryHeader/>', () => {
  afterAll(mockdate.reset)

  it('should render the activation banner when user is eligible and api call returns activation banner', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', mockStep)
    mockServer.getApi<BannerResponse>('/v1/banner', {
      banner: {
        name: BannerName.activation_banner,
        text: 'à dépenser sur l’application',
        title: 'Débloque tes 1000\u00a0€',
      },
    })

    renderNonBeneficiaryHeader({
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    expect(await screen.findByTestId('eligibility-banner-container')).toBeOnTheScreen()

    expect(screen.getByText('Débloque tes 1000\u00a0€')).toBeOnTheScreen()
    expect(screen.getByTestId('BicolorUnlock')).toBeOnTheScreen()
    expect(screen.getByText('à dépenser sur l’application')).toBeOnTheScreen()
  })

  it("should render the transition 17 to 18 banner when beneficiary's user is now 18", async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', mockStep)
    mockServer.getApi<BannerResponse>('/v1/banner', {
      banner: {
        name: BannerName.transition_17_18_banner,
        text: 'à dépenser sur l’application',
        title: 'Débloque tes 400\u00a0€',
      },
    })

    renderNonBeneficiaryHeader({
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    expect(await screen.findByTestId('eligibility-banner-container')).toBeOnTheScreen()

    expect(screen.getByText('Débloque tes 400\u00a0€')).toBeOnTheScreen()
    expect(screen.getByTestId('BirthdayCake')).toBeOnTheScreen()
    expect(screen.getByText('à dépenser sur l’application')).toBeOnTheScreen()
  })

  it('should display identity check message if user identity check is pending', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', {
      ...mockStep,
      hasIdentityCheckPending: true,
    })
    mockServer.getApi<BannerResponse>('/v1/banner', {})

    renderNonBeneficiaryHeader({
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    await act(async () => {})

    expect(screen.queryByTestId('eligibility-banner-container')).not.toBeOnTheScreen()
    expect(screen.getByText('Ton inscription est en cours de traitement.')).toBeOnTheScreen()
  })

  it('should render the subscription message if there is one', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', {
      ...mockStep,
      subscriptionMessage: mockedSubscriptionMessage,
    })
    mockServer.getApi<BannerResponse>('/v1/banner', {})

    renderNonBeneficiaryHeader({
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    await act(async () => {})

    expect(screen.getByTestId('subscription-message-badge')).toBeOnTheScreen()
  })

  it('should render the younger badge for user whose eligibilty hasn’t started yet (under 15 years old)', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', mockStep)
    mockServer.getApi<BannerResponse>('/v1/banner', {})
    renderNonBeneficiaryHeader({
      startDatetime: '2021-03-31T00:00Z',
      endDatetime: '2022-03-31T00:00Z',
    })

    await act(async () => {})

    expect(screen.getByTestId('younger-badge')).toBeOnTheScreen()
  })

  it('should not display banner or badge when user is beneficiary', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', {
      ...mockStep,
      hasIdentityCheckPending: false,
    })
    mockServer.getApi<BannerResponse>('/v1/banner', {})

    renderNonBeneficiaryHeader({
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    await act(async () => {})

    expect(screen.queryByTestId('subscription-message-badge')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('eligibility-banner-container')).not.toBeOnTheScreen()
    expect(screen.queryByText('Ton inscription est en cours de traitement.')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('younger-badge')).not.toBeOnTheScreen()
  })
})

function renderNonBeneficiaryHeader({
  startDatetime,
  endDatetime,
}: {
  startDatetime: string
  endDatetime: string
}) {
  return render(
    <NonBeneficiaryHeader
      eligibilityStartDatetime={startDatetime}
      eligibilityEndDatetime={endDatetime}
    />,
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
}
