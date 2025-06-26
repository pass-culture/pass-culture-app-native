import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

type HeroButtonListProps = {
  Title: ReactElement
  Subtitle?: ReactElement
  Icon?: ReactElement
  navigateTo: InternalNavigationProps['navigateTo']
  accessibilityLabel?: string
  onBeforeNavigate?: () => void
}

export function HeroButtonList({
  Title,
  Subtitle,
  Icon,
  navigateTo,
  accessibilityLabel,
  onBeforeNavigate,
}: Readonly<HeroButtonListProps>) {
  const focusProps = useHandleFocus()

  return (
    <StyledInternalTouchableLink
      {...focusProps}
      navigateTo={navigateTo}
      testID="HeroButtonList"
      accessibilityLabel={accessibilityLabel}
      onBeforeNavigate={onBeforeNavigate}>
      <GenericBanner LeftIcon={Icon}>
        <TextWrapper>
          {Title}
          {Subtitle ? <SubtitleContainer>{Subtitle}</SubtitleContainer> : null}
        </TextWrapper>
      </GenericBanner>
    </StyledInternalTouchableLink>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs<{
  color: ColorsEnum
}>(({ color }) => ({
  hoverUnderlineColor: color,
}))<{ isFocus: boolean }>(({ theme, isFocus }) => ({
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus }),
}))

const TextWrapper = styled.View({
  minHeight: getSpacing(14.5),
  justifyContent: 'center',
})

const SubtitleContainer = styled.View({
  marginTop: getSpacing(1),
})
