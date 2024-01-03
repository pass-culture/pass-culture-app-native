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

export function HeroButtonList(props: Readonly<HeroButtonListProps>) {
  return (
    <InternalTouchableLink
      navigateTo={props.navigateTo}
      testID="HeroButtonList"
      accessibilityLabel={props.accessibilityLabel}
      onBeforeNavigate={props.onBeforeNavigate}>
      <GenericBanner LeftIcon={props.Icon}>
        <TextWrapper>
          {props.Title}
          {!!props.Subtitle && <SubtitleContainer>{props.Subtitle}</SubtitleContainer>}
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
