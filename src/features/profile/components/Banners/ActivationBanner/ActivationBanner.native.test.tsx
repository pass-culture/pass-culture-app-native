import React from 'react'
import { Linking } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentityCheckMethod } from 'api/gen'
import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { ActivationBanner } from 'features/profile/components/Banners/ActivationBanner/ActivationBanner'
import { BannerType } from 'features/profile/helpers/getBannerActivationType'
import * as bannerHelper from 'features/profile/helpers/getBannerActivationType'
import { beneficiaryUser } from 'fixtures/user'
import { useFeatureFlagOptionsQuery } from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/context/AuthContext')
jest.useFakeTimers()

jest.mock('features/home/api/useActivationBanner', () => ({
  useActivationBanner: jest.fn(),
}))
jest.mock('features/identityCheck/queries/useGetStepperInfoQuery', () => ({
  useGetStepperInfoQuery: jest.fn(),
}))
jest.mock('libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery', () => ({
  useFeatureFlagOptionsQuery: jest.fn(),
}))

jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false)

const mockUseActivationBanner = useActivationBanner as jest.Mock
const mockUseGetStepperInfoQuery = useGetStepperInfoQuery as jest.Mock
const mockUseFeatureFlagOptionsQuery = useFeatureFlagOptionsQuery as jest.Mock

const featureFlags = {
  disableActivation: false,
}

describe('ActivationBanner', () => {
  beforeEach(() => {
    mockUseActivationBanner.mockReturnValue({
      banner: { title: 'Titre', text: 'Texte', name: 'activation_banner' },
    })
    mockUseGetStepperInfoQuery.mockReturnValue({ data: {} })
    mockUseFeatureFlagOptionsQuery.mockReturnValue({ options: { message: 'désactivé' } })
  })

  it('should navigate to the identity check stepper when WIP_SIMPLIFIED_ACTIVATION_18 flag is disabled', async () => {
    setFeatureFlags([])
    mockAuthContextWithUser(
      { ...beneficiaryUser, domainsCredit: { all: { initial: 5000, remaining: 0 } } },
      { persist: true }
    )
    mockUseGetStepperInfoQuery.mockReturnValueOnce({
      data: { underageOkIdentityCheckMethod: IdentityCheckMethod.educonnect },
    })
    jest
      .spyOn(bannerHelper, 'getBannerActivationType')
      .mockReturnValueOnce(BannerType.ACTIVATION_DEFAULT)

    render(<ActivationBanner featureFlags={featureFlags} />)
    await userEvent.setup().press(screen.getByLabelText('Titre - Texte'))

    expect(navigate.mock.calls.at(-1)).toEqual([
      'SubscriptionStackNavigator',
      { screen: 'Stepper', params: { from: 'home' } },
    ])
  })

  describe('when WIP_SIMPLIFIED_ACTIVATION_18 flag enabled', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_SIMPLIFIED_ACTIVATION_18])
    })

    it('should navigate to UnlockEighteenCredit when user has initial credit', async () => {
      mockAuthContextWithUser(
        { ...beneficiaryUser, domainsCredit: { all: { initial: 5000, remaining: 0 } } },
        { persist: true }
      )
      mockUseGetStepperInfoQuery.mockReturnValueOnce({
        data: { underageOkIdentityCheckMethod: IdentityCheckMethod.educonnect },
      })
      jest
        .spyOn(bannerHelper, 'getBannerActivationType')
        .mockReturnValueOnce(BannerType.ACTIVATION_DEFAULT)

      render(<ActivationBanner featureFlags={featureFlags} />)
      await userEvent.setup().press(screen.getByLabelText('Titre - Texte'))

      expect(navigate.mock.calls.at(-1)).toEqual(['EighteenBirthday'])
    })

    it('should navigate to the identity check stepper when user has no initial credit', async () => {
      mockAuthContextWithUser(
        { ...beneficiaryUser, domainsCredit: { all: { initial: 0, remaining: 0 } } },
        { persist: true }
      )
      mockUseGetStepperInfoQuery.mockReturnValueOnce({
        data: { underageOkIdentityCheckMethod: IdentityCheckMethod.educonnect },
      })
      jest
        .spyOn(bannerHelper, 'getBannerActivationType')
        .mockReturnValueOnce(BannerType.ACTIVATION_DEFAULT)

      render(<ActivationBanner featureFlags={featureFlags} />)
      await userEvent.setup().press(screen.getByLabelText('Titre - Texte'))

      expect(navigate.mock.calls.at(-1)).toEqual([
        'SubscriptionStackNavigator',
        { screen: 'Stepper', params: { from: 'home' } },
      ])
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each`
    bannerType                                         | testId
    ${BannerType.ACTIVATION_DISABLED}                  | ${'activation-disabled-banner'}
    ${BannerType.ACTIVATION_RETRY}                     | ${'activation-banner-with-subscription-message'}
    ${BannerType.ACTIVATION_WITH_SUBSCRIPTION_MESSAGE} | ${'activation-banner-with-subscription-message'}
    ${BannerType.ACTIVATION_PENDING}                   | ${'activation-banner-pending'}
    ${BannerType.ACTIVATION_DEFAULT}                   | ${'activation-banner-default'}
    ${undefined}                                       | ${'activation-banner-default'}
  `('renders the correct banner for $bannerType', ({ bannerType, testId }) => {
    mockUseActivationBanner.mockReturnValueOnce({
      banner: { title: 'Titre', text: 'Texte', name: 'activation_banner' },
    })
    mockUseGetStepperInfoQuery.mockReturnValueOnce({ data: {} })
    mockUseFeatureFlagOptionsQuery.mockReturnValueOnce({ options: { message: 'désactivé' } })

    jest.spyOn(bannerHelper, 'getBannerActivationType').mockReturnValueOnce(bannerType)

    render(<ActivationBanner featureFlags={featureFlags} />)

    expect(screen.getByTestId(testId)).toBeOnTheScreen()
  })
})
