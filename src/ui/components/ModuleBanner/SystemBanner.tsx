import React, { FunctionComponent, useEffect } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { ColorScheme } from 'libs/styled/useColorScheme'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/accessibilityRoleInternalNavigation'
import { ColorsType } from 'theme/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type TouchableProps =
  | {
      onPress: () => void
      onBeforeNavigate?: never
      navigateTo?: never
      externalNav?: never
    }
  | {
      navigateTo: InternalNavigationProps['navigateTo']
      onBeforeNavigate?: () => void
      onPress?: never
      externalNav?: never
    }
  | {
      externalNav: ExternalNavigationProps['externalNav']
      onBeforeNavigate?: () => void
      onPress?: never
      navigateTo?: never
    }

type Props = {
  leftIcon: React.FunctionComponent<AccessibleIcon>
  title: string
  subtitle: string | React.ReactNode
  accessibilityLabel?: string
  accessibilityRole?: AccessibilityRole
  analyticsParams: {
    type: 'credit' | 'location' | 'remoteActivationBanner' | 'remoteGenericBanner'
    from: 'home' | 'thematicHome' | 'offer' | 'profile' | 'search' | 'cheatcodes'
  }
  withBackground?: boolean
  style?: StyleProp<ViewStyle>
} & TouchableProps

export const SystemBanner: FunctionComponent<Props> = ({
  leftIcon: LeftIcon,
  title,
  subtitle,
  accessibilityLabel,
  accessibilityRole,
  analyticsParams: { type, from },
  withBackground = false,
  style,
  ...touchableProps
}) => {
  const { designSystem, colorScheme } = useTheme()
  const focusProps = useHandleFocus()

  useEffect(() => {
    analytics.logSystemBlockDisplayed({ type, from })
  }, [type, from])

  const color = withBackground ? 'inverted' : 'default'

  const iconColorWithBackground =
    colorScheme === ColorScheme.DARK
      ? designSystem.color.icon.locked
      : designSystem.color.icon.lockedInverted

  const iconColor = withBackground
    ? iconColorWithBackground
    : designSystem.color.icon.brandSecondary

  const backgroundColor = withBackground
    ? designSystem.color.background.brandSecondary
    : designSystem.color.background.default

  const borderColor = designSystem.color.border.brandSecondary

  const StyledIcon = LeftIcon
    ? styled(LeftIcon).attrs(({ theme }) => ({
        color: iconColor,
        size: theme.icons.sizes.standard,
      }))``
    : undefined

  let TouchableComponent: React.ComponentType<
    | React.ComponentProps<typeof StyledInternalTouchableLink>
    | React.ComponentProps<typeof StyledExternalTouchableLink>
    | React.ComponentProps<typeof StyledTouchableOpacity>
  >
  if ('navigateTo' in touchableProps) {
    TouchableComponent = StyledInternalTouchableLink
  } else if ('externalNav' in touchableProps) {
    TouchableComponent = StyledExternalTouchableLink
  } else {
    TouchableComponent = StyledTouchableOpacity
  }

  const subtitleText = typeof subtitle === 'string' ? subtitle : ''

  return (
    <TouchableComponent
      {...touchableProps}
      {...focusProps}
      accessibilityRole={accessibilityRole ?? accessibilityRoleInternalNavigation()}
      accessibilityLabel={accessibilityLabel ?? `${title} ${subtitleText}`}
      color={
        withBackground ? designSystem.color.text.lockedInverted : designSystem.color.text.default
      }
      style={style}>
      <Container backgroundColor={backgroundColor} borderColor={borderColor} testID="systemBanner">
        {StyledIcon ? (
          <IconContainer>
            <StyledIcon />
          </IconContainer>
        ) : null}
        <DescriptionContainer gap={1}>
          <Typo.BodyAccent color={color}>{title}</Typo.BodyAccent>
          {React.isValidElement(subtitle) ? (
            subtitle
          ) : (
            <Typo.Body color={color}>{subtitle}</Typo.Body>
          )}
        </DescriptionContainer>
        <View>
          <StyledArrowNextIcon color={iconColor} />
        </View>
      </Container>
    </TouchableComponent>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink).attrs<{
  color: ColorsType
}>(({ color }) => ({
  hoverUnderlineColor: color,
}))<{ isFocus: boolean; color: ColorsType }>(({ theme, isFocus, color }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ isFocus, color }),
}))

const StyledExternalTouchableLink = styled(ExternalTouchableLink).attrs<{
  color: ColorsType
}>(({ color }) => ({
  hoverUnderlineColor: color,
}))<{ isFocus: boolean; color: ColorsType }>(({ theme, isFocus, color }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ isFocus, color }),
}))

const StyledTouchableOpacity = styledButton(Touchable)<{
  color: ColorsType
}>(({ theme, color }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ color }),
  ...getHoverStyle({ underlineColor: color }),
}))

const Container = styled.View<{ backgroundColor: ColorsType; borderColor: ColorsType }>(
  ({ theme, backgroundColor, borderColor }) => ({
    alignItems: 'center',
    backgroundColor,
    borderColor,
    borderRadius: theme.designSystem.size.borderRadius.m,
    borderStyle: 'solid',
    borderWidth: 1,
    flexDirection: 'row',
    padding: getSpacing(4),
    width: '100%',
  })
)

const IconContainer = styled.View({
  alignContent: 'center',
  marginRight: getSpacing(4),
})

const DescriptionContainer = styled(ViewGap)({
  flexShrink: 1,
  flexGrow: 1,
  marginRight: getSpacing(4),
  textAlign: 'start',
})

const StyledArrowNextIcon = styled(ArrowNext).attrs(({ theme, color }) => ({
  size: theme.icons.sizes.small,
  color,
}))``
