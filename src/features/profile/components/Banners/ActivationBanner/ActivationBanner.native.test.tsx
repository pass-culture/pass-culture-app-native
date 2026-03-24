import React from 'react'
import { Linking } from 'react-native'

import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { ActivationBanner } from 'features/profile/components/Banners/ActivationBanner/ActivationBanner'
import { BannerType } from 'features/profile/helpers/getBannerActivationType'
import * as bannerHelper from 'features/profile/helpers/getBannerActivationType'
import { useFeatureFlagOptionsQuery } from 'libs/firebase/firestore/featureFlags/queries/useFeatureFlagOptionsQuery'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

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
  enablePassForAll: false,
  enableProfileV2: false,
  disableActivation: false,
}

describe('ActivationBanner', () => {
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
