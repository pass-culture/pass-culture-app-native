import React, { FunctionComponent, ReactElement } from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type IdentificationForkButtonProps = {
  Title: ReactElement
  Subtitle?: ReactElement
  icon: FunctionComponent<IconInterface>
  navigateTo: InternalNavigationProps['navigateTo']
  accessibilityLabel?: string
  onBeforeNavigate?: () => void
}

export const IdentificationForkButton: FunctionComponent<IdentificationForkButtonProps> = (
  props
) => {
  const Icon = styled(props.icon).attrs(({ theme }) => ({
    color: theme.colors.white,
    color2: theme.colors.secondary,
    size: 40,
  }))``

  return (
    <InternalTouchableLink
      navigateTo={props.navigateTo}
      testID={`IdentificationForkButton`}
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
