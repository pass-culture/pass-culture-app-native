import React from 'react'
import { Linking } from 'react-native'

import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { underageBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { GeneralPublicBanner } from './GeneralPublicBanner'

jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)
jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')

const mockSubscriptionMessage = { subscriptionMessage: { userMessage: 'userMessage' } }
jest.mock('features/identityCheck/queries/useGetStepperInfoQuery', () => ({
  useGetStepperInfoQuery: () => ({
    data: mockSubscriptionMessage,
  }),
}))

const featureFlags = {
  enablePassForAll: true,
  enableProfileV2: true,
  disableActivation: false,
}

describe('GeneralPublicBanner', () => {
  beforeEach(() => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.ENABLE_PASS_FOR_ALL,
      RemoteStoreFeatureFlags.ENABLE_PROFILE_V2,
    ])
  })

  it('should return null if user is undefined', () => {
    render(
      reactQueryProviderHOC(
        <GeneralPublicBanner
          user={undefined as unknown as UserProfileResponseWithoutSurvey}
          featureFlags={featureFlags}
        />
      )
    )

    expect(screen.queryByTestId(/activation-banner/)).not.toBeOnTheScreen()
    expect(screen.queryByTestId('younger-banner')).not.toBeOnTheScreen()
  })

  it('should render YoungerBanner if user is too young', () => {
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)

    const user = {
      ...underageBeneficiaryUser,
      eligibilityStartDatetime: futureDate.toISOString(),
    }

    render(reactQueryProviderHOC(<GeneralPublicBanner user={user} featureFlags={featureFlags} />))

    expect(screen.getByTestId('younger-banner')).toBeOnTheScreen()
  })

  it('should render ActivationBanner if subscriptionMessage exists', () => {
    const pastDate = new Date()
    pastDate.setFullYear(pastDate.getFullYear() - 1)

    const user = {
      ...underageBeneficiaryUser,
      eligibilityStartDatetime: pastDate.toISOString(),
      subscriptionMessage: mockSubscriptionMessage.subscriptionMessage,
    }

    render(reactQueryProviderHOC(<GeneralPublicBanner user={user} featureFlags={featureFlags} />))

    expect(screen.getByTestId('activation-banner-with-subscription-message')).toBeOnTheScreen()
  })

  it('should return null if user is eligible but no subscriptionMessage', () => {
    const pastDate = new Date()
    pastDate.setFullYear(pastDate.getFullYear() - 1)

    const user = {
      ...underageBeneficiaryUser,
      eligibilityStartDatetime: pastDate.toISOString(),
    }

    render(reactQueryProviderHOC(<GeneralPublicBanner user={user} featureFlags={featureFlags} />))

    expect(screen.queryByTestId(/activation-banner/)).not.toBeOnTheScreen()
    expect(screen.queryByTestId('younger-banner')).not.toBeOnTheScreen()
  })
})
