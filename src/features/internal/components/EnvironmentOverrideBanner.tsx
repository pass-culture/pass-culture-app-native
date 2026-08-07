import React from 'react'
import styled from 'styled-components/native'

import {
  getEffectiveEnvironment,
  isEnvironmentOverridden,
} from 'libs/environment/envOverride/envOverride'
import { Typo } from 'ui/theme'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

export const EnvironmentOverrideBanner = (): React.JSX.Element | null => {
  const { top } = useCustomSafeInsets()

  if (!isEnvironmentOverridden()) return null

  return (
    <BannerContainer topSafeInsets={top} pointerEvents="none">
      <BannerText>{getEffectiveEnvironment().toUpperCase()}</BannerText>
    </BannerContainer>
  )
}

const BannerContainer = styled.View<{ topSafeInsets: number }>(({ theme, topSafeInsets }) => ({
  position: 'absolute',
  top: topSafeInsets,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.cheatCodeButton,
  backgroundColor: theme.designSystem.color.background.success,
  paddingVertical: theme.designSystem.size.spacing.xs,
  justifyContent: 'center',
  alignItems: 'center',
}))

const BannerText = styled(Typo.BodyAccentS)(({ theme }) => ({
  color: theme.designSystem.color.text.success,
}))
