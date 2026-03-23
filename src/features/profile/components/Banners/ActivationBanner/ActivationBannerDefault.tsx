import React from 'react'
import { View } from 'react-native'

import { ActivationBanner as ActivationBannerProps } from 'features/home/api/useActivationBanner'
import { getComputedAccessibilityLabel } from 'shared/accessibility/helpers/getComputedAccessibilityLabel'
import { SystemBanner } from 'ui/components/ModuleBanner/SystemBanner'
import { Unlock } from 'ui/svg/icons/Unlock'

type Props = { banner: ActivationBannerProps; onPress: () => void }

export const ActivationBannerDefault = ({ banner, onPress }: Props) => {
  const bannerTitle = banner.title
  const bannerSubtitle = banner.text
  const bannerAccessibilityLabel = getComputedAccessibilityLabel(bannerTitle, bannerSubtitle)

  return (
    <View testID="activation-banner-default">
      <SystemBanner
        leftIcon={Unlock}
        title={bannerTitle}
        subtitle={bannerSubtitle}
        onPress={onPress}
        accessibilityLabel={bannerAccessibilityLabel}
        analyticsParams={{ type: 'credit', from: 'profile' }}
      />
    </View>
  )
}
