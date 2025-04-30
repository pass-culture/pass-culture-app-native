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
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ILocationContext, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { useGetDepositAmountsByAge } from 'shared/user/useGetDepositAmountsByAge'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

jest.mock('queries/profile/usePatchProfileMutation')

const mockedSubscriptionMessage = {
  popOverIcon: 'FILE',
  updatedAt: '2021-10-25T13:24Z',
  userMessage: 'Dossier déposé, nous sommes en train de le traiter',
} as SubscriptionMessage

const today = '2021-03-30T00:00:00Z'
mockdate.set(new Date(today))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/location')
const mockUseGeolocation = jest.mocked(useLocation)

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = jest.mocked(useAuthContext)

jest.mock('shared/user/useGetDepositAmountsByAge')
const mockDepositAmounts = jest.mocked(useGetDepositAmountsByAge)

describe('<NonBeneficiaryHeader/>', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockDepositAmounts.mockReturnValue(undefined)
    mockUseGeolocation.mockReturnValue({
      selectedLocationMode: LocationMode.EVERYWHERE,
    } as ILocationContext)
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      user: undefined,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

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
      featureFlags: { disableActivation: false },
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    expect(await screen.findByTestId('eligibility-system-banner-container')).toBeOnTheScreen()

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
      featureFlags: { disableActivation: false },
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    expect(await screen.findByTestId('eligibility-system-banner-container')).toBeOnTheScreen()

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
      featureFlags: { disableActivation: false },
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    await waitFor(() => {
      expect(screen.queryByTestId('eligibility-system-banner-container')).not.toBeOnTheScreen()
      expect(screen.getByTestId('identity-check-pending-badge')).toBeOnTheScreen()
    })
  })

  it('should render the subscription message if there is one', async () => {
    setFeatureFlags([{ featureFlag: RemoteStoreFeatureFlags.DISABLE_ACTIVATION, options: {} }])
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', {
      ...mockStep,
      subscriptionMessage: mockedSubscriptionMessage,
    })
    mockServer.getApi<BannerResponse>('/v1/banner', {})

    renderNonBeneficiaryHeader({
      featureFlags: { disableActivation: false },
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    await waitFor(() => {
      expect(screen.getByTestId('subscription-message-badge')).toBeOnTheScreen()
    })
  })

  it('should render the younger badge for user whose eligibilty hasn’t started yet (under 15 years old)', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', mockStep)
    mockServer.getApi<BannerResponse>('/v1/banner', {})
    renderNonBeneficiaryHeader({
      featureFlags: { disableActivation: false },
      startDatetime: '2021-03-31T00:00Z',
      endDatetime: '2022-03-31T00:00Z',
    })

    await waitFor(() => {
      expect(screen.getByTestId('younger-badge')).toBeOnTheScreen()
    })
  })

  it('should not display banner or badge when user is beneficiary', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>('/v2/subscription/stepper', {
      ...mockStep,
      hasIdentityCheckPending: false,
    })
    mockServer.getApi<BannerResponse>('/v1/banner', {})

    renderNonBeneficiaryHeader({
      featureFlags: { disableActivation: false },
      startDatetime: '2021-03-30T00:00Z',
      endDatetime: '2022-02-30T00:00Z',
    })

    await waitFor(() => {
      expect(screen.queryByTestId('subscription-message-badge')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('eligibility-banner-container')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('identity-check-pending-badge')).not.toBeOnTheScreen()
      expect(screen.queryByTestId('younger-badge')).not.toBeOnTheScreen()
    })
  })
})

function renderNonBeneficiaryHeader({
  featureFlags,
  startDatetime,
  endDatetime,
}: {
  featureFlags: { disableActivation: boolean }
  startDatetime: string
  endDatetime: string
}) {
  return render(
    <NonBeneficiaryHeader
      featureFlags={featureFlags}
      eligibilityStartDatetime={startDatetime}
      eligibilityEndDatetime={endDatetime}
    />,
    {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    }
  )
}
