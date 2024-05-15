import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing } from 'ui/theme'

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
  return (
    <InternalTouchableLink
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
    </InternalTouchableLink>
  )
}

const TextWrapper = styled.View({
  minHeight: getSpacing(14.5),
  justifyContent: 'center',
})

const SubtitleContainer = styled.View({
  marginTop: getSpacing(1),
})
