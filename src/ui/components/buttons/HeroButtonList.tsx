import React, { FunctionComponent, ReactElement } from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type HeroButtonListProps = {
  Title: ReactElement
  Subtitle?: ReactElement
  icon: FunctionComponent<IconInterface>
  navigateTo: InternalNavigationProps['navigateTo']
  accessibilityLabel?: string
  onBeforeNavigate?: () => void
  iconProps?: IconInterface
}

export function HeroButtonList(props: Readonly<HeroButtonListProps>) {
  const Icon = styled(props.icon).attrs(({ theme }) => ({
    color: props.iconProps?.color ?? theme.colors.primary,
    color2: props.iconProps?.color2 ?? theme.colors.secondary,
    size: props.iconProps?.size ?? theme.icons.sizes.standard,
  }))``

  return (
    <InternalTouchableLink
      navigateTo={props.navigateTo}
      testID="HeroButtonList"
      accessibilityLabel={props.accessibilityLabel}
      onBeforeNavigate={props.onBeforeNavigate}>
      <GenericBanner LeftIcon={Icon}>
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
