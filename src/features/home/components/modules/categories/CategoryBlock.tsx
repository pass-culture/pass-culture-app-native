import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { Color } from 'features/home/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { theme } from 'theme'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing, Typo } from 'ui/theme'
import { gradientColorsMapping } from 'ui/theme/gradientColorsMapping'

import { Shape } from './Shape'

const BLOCK_HEIGHT = getSpacing(24)

interface CategoryBlockProps {
  title: string
  navigateTo: InternalNavigationProps['navigateTo']
  color: Color
  onBeforePress: () => void | Promise<void>
}

export function CategoryBlock({
  title,
  navigateTo,
  color,
  onBeforePress,
}: Readonly<CategoryBlockProps>) {
  const enableAppV2CategoryBlock =
    useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_CATEGORY_BLOCK) || false

  return (
    <StyledInternalTouchableLink onBeforeNavigate={onBeforePress} navigateTo={navigateTo}>
      <ColoredContainer
        colors={gradientColorsMapping[color]}
        enableAppV2CategoryBlock={enableAppV2CategoryBlock}>
        <StyledShape color={color} height={BLOCK_HEIGHT} />
        <StyledTitle numberOfLines={2}>{title}</StyledTitle>
      </ColoredContainer>
    </StyledInternalTouchableLink>
  )
}

const ColoredContainer = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
})<{ enableAppV2CategoryBlock: boolean }>(({ theme, enableAppV2CategoryBlock }) => ({
  flex: 1,
  flexDirection: 'column-reverse',
  borderRadius: theme.borderRadius.radius,
  ...(enableAppV2CategoryBlock ? { width: '200px' } : {}),
}))

const StyledShape = styled(Shape)({ position: 'absolute', right: 0 })

const StyledTitle = styled(Typo.ButtonText)({
  color: theme.colors.white,
  margin: getSpacing(3),
})

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs(({ theme }) => ({
  hoverUnderlineColor: theme.colors.white,
}))({
  height: BLOCK_HEIGHT,
})
