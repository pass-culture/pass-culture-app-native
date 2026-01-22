import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/accessibilityRoleInternalNavigation'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface BaseHeroButtonListProps {
  Title: ReactElement
  Subtitle?: ReactElement
  Icon?: ReactElement
  accessibilityLabel?: string
}

// We either want to separate navigation and other actions, or pass the onPress directly
type HeroButtonListProps = BaseHeroButtonListProps &
  (
    | {
        navigateTo: InternalNavigationProps['navigateTo']
        onBeforeNavigate?: () => void | Promise<void> // analytics are async
        onPress?: never
      }
    | {
        navigateTo?: never
        onBeforeNavigate?: never
        onPress: () => void | Promise<void>
      }
  )

export function HeroButtonList({
  Title,
  Subtitle,
  Icon,
  navigateTo,
  accessibilityLabel,
  onBeforeNavigate,
  onPress,
}: Readonly<HeroButtonListProps>) {
  const focusProps = useHandleFocus()

  if (navigateTo) {
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
  } else {
    return (
      <StyledTouchableLink
        {...focusProps}
        testID="HeroButtonList"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRoleInternalNavigation()}
        onPress={onPress}>
        <GenericBanner LeftIcon={Icon}>
          <TextWrapper>
            {Title}
            {Subtitle ? <SubtitleContainer>{Subtitle}</SubtitleContainer> : null}
          </TextWrapper>
        </GenericBanner>
      </StyledTouchableLink>
    )
  }
}

const StyledInternalTouchableLink = styled(InternalTouchableLink)<{ isFocus: boolean }>(
  ({ theme, isFocus }) => ({
    borderRadius: theme.designSystem.size.borderRadius.m,
    ...customFocusOutline({ theme, isFocus }),
  })
)

const StyledTouchableLink = styled(TouchableLink)<{ isFocus: boolean }>(({ theme, isFocus }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ theme, isFocus }),
}))

const TextWrapper = styled.View({
  minHeight: getSpacing(14.5),
  justifyContent: 'center',
})

const SubtitleContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
}))
