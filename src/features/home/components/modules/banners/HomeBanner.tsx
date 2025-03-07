import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components/native'

import { BannerName } from 'api/gen'
import { useActivationBanner } from 'features/home/api/useActivationBanner'
import { SignupBanner } from 'features/home/components/banners/SignupBanner'
import { StepperOrigin, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { RemoteActivationBanner } from 'features/remoteBanners/banners/RemoteActivationBanner'
import { RemoteGenericBanner } from 'features/remoteBanners/banners/RemoteGenericBanner'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SystemBanner as GenericSystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { ArrowAgain } from 'ui/svg/icons/ArrowAgain'
import { BicolorUnlock } from 'ui/svg/icons/BicolorUnlock'
import { BirthdayCake } from 'ui/svg/icons/BirthdayCake'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type HomeBannerProps = {
  isLoggedIn: boolean
}

const StyledBicolorUnlock = styled(BicolorUnlock).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const StyledArrowAgain = styled(ArrowAgain).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const StyledBirthdayCake = styled(BirthdayCake).attrs(({ theme }) => ({
  color: theme.colors.secondaryLight200,
}))``

const systemBannerIcons: {
  [key in Exclude<BannerName, 'geolocation_banner'>]: React.FunctionComponent<AccessibleIcon>
} = {
  [BannerName.activation_banner]: StyledBicolorUnlock,
  [BannerName.retry_identity_check_banner]: StyledArrowAgain,
  [BannerName.transition_17_18_banner]: StyledBirthdayCake,
}

const bannersToRender = [
  BannerName.activation_banner,
  BannerName.retry_identity_check_banner,
  BannerName.transition_17_18_banner,
]

export const HomeBanner = ({ isLoggedIn }: HomeBannerProps) => {
  const showRemoteGenericBanner = useFeatureFlag(RemoteStoreFeatureFlags.SHOW_REMOTE_GENERIC_BANNER)
  const disableActivation = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)

  const { banner } = useActivationBanner()
  const { navigate } = useNavigation<UseNavigationType>()

  const shouldRenderSystemBanner = banner.name ? bannersToRender.includes(banner.name) : false

  const systemBannerAnalyticsType =
    banner.name === BannerName.geolocation_banner ? 'location' : 'credit'

  const onPressSystemBanner = useCallback(
    (from: StepperOrigin) => {
      navigate('Stepper', { from })
    },
    [navigate]
  )

  const renderSystemBanner = useCallback(
    (Icon: React.FunctionComponent<AccessibleIcon>, title: string, subtitle: string) => (
      <BannerContainer>
        <GenericSystemBanner
          leftIcon={Icon}
          title={title}
          subtitle={subtitle}
          onPress={() => onPressSystemBanner(StepperOrigin.HOME)}
          accessibilityLabel={subtitle}
          analyticsParams={{ type: systemBannerAnalyticsType, from: 'home' }}
        />
      </BannerContainer>
    ),
    [systemBannerAnalyticsType, onPressSystemBanner]
  )

  const SystemBanner = useMemo(() => {
    if (disableActivation) {
      return (
        <BannerContainer>
          <RemoteActivationBanner from="home" />
        </BannerContainer>
      )
    }

    if (!isLoggedIn) {
      return (
        <BannerContainer>
          <SignupBanner />
        </BannerContainer>
      )
    }

    if (
      shouldRenderSystemBanner &&
      banner.name &&
      banner.name !== BannerName.geolocation_banner &&
      banner.title &&
      banner.text
    ) {
      return renderSystemBanner(systemBannerIcons[banner.name], banner.title, banner.text)
    }

    return null
  }, [isLoggedIn, shouldRenderSystemBanner, renderSystemBanner, banner, disableActivation])

  return (
    <React.Fragment>
      {showRemoteGenericBanner ? (
        <RemoteGenericBannerContainer>
          <RemoteGenericBanner from="home" />
        </RemoteGenericBannerContainer>
      ) : null}
      {SystemBanner}
    </React.Fragment>
  )
}

const BannerContainer = styled.View({
  marginBottom: getSpacing(8),
})

const RemoteGenericBannerContainer = styled.View({
  marginBottom: getSpacing(6),
})
