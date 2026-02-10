import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/accessibilityRoleInternalNavigation'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type HeroButtonListProps = {
  Title: ReactElement
  Subtitle?: ReactElement
  Icon?: ReactElement
  accessibilityLabel?: string
  onPress: () => void | Promise<void>
}

export function HeroButtonListWithOnPress({
  Title,
  Subtitle,
  Icon,
  accessibilityLabel,
  onPress,
}: Readonly<HeroButtonListProps>) {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  const { onMouseEnter, onMouseLeave, isHover } = useHandleHover()

  return (
    <StyledTouchableOpacity
      testID="HeroButtonList"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRoleInternalNavigation()}
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isFocus={isFocus}
      isHover={isHover}>
      <GenericBanner LeftIcon={Icon}>
        <TextWrapper>
          {Title}
          {Subtitle ? <SubtitleContainer>{Subtitle}</SubtitleContainer> : null}
        </TextWrapper>
      </GenericBanner>
    </StyledTouchableOpacity>
  )
}

// We define the extra props here to satisfy TypeScript
type StyledTouchableOpacityProps = {
  isFocus: boolean
  isHover: boolean
  // React Native types don't include these by default, so we add them optionally (for the web)
  onMouseEnter?: (e: unknown) => void
  onMouseLeave?: (e: unknown) => void
}

const StyledTouchableOpacity = styled(TouchableOpacity)<StyledTouchableOpacityProps>(
  ({ theme, isFocus, isHover }) => ({
    borderRadius: theme.designSystem.size.borderRadius.m,
    ...customFocusOutline({ theme, isFocus }),
    ...getHoverStyle({
      underlineColor: theme.designSystem.color.text.default,
      isHover,
    }),
  })
)

const TextWrapper = styled.View({
  minHeight: getSpacing(14.5),
  justifyContent: 'center',
})

const SubtitleContainer = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.xs,
}))
