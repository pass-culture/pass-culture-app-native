import React, { FunctionComponent, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { theme } from 'theme'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ExternalNavigationProps, InternalNavigationProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
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
  accessibilityLabel: string
  accessibilityRole?: AccessibilityRole
  analyticsParams: {
    type: 'credit' | 'location' | 'remoteActivationBanner' | 'remoteGenericBanner'
    from: 'home' | 'thematicHome' | 'offer' | 'profile' | 'search' | 'cheatcodes'
  }
  withBackground?: boolean
} & TouchableProps

export const SystemBanner: FunctionComponent<Props> = ({
  leftIcon: LeftIcon,
  title,
  subtitle,
  accessibilityLabel,
  accessibilityRole,
  analyticsParams: { type, from },
  withBackground = false,
  ...touchableProps
}) => {
  const focusProps = useHandleFocus()

  useEffect(() => {
    analytics.logSystemBlockDisplayed({ type, from })
  }, [type, from])

  const color = withBackground ? 'inverted' : 'default'
  const iconColor = withBackground ? theme.colors.white : theme.colors.secondaryLight200
  const backgroundColor = withBackground ? theme.uniqueColors.brand : theme.colors.transparent
  const borderColor = withBackground ? theme.uniqueColors.brand : theme.colors.secondaryLight200

  const StyledIcon = LeftIcon
    ? styled(LeftIcon).attrs(({ theme }) => ({
        color: iconColor,
        color2: iconColor,
        size: theme.icons.sizes.standard,
      }))``
    : undefined

  const getTouchableComponent = (props: TouchableProps) => {
    if ('navigateTo' in props) return StyledInternalTouchableLink
    if ('externalNav' in props) return StyledExternalTouchableLink
    return StyledTouchableOpacity
  }

  const TouchableComponent = getTouchableComponent(touchableProps)

  return (
    <TouchableComponent
      {...touchableProps}
      {...focusProps}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      color={withBackground ? theme.colors.white : theme.colors.black}>
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
  color: ColorsEnum
}>(({ color }) => ({
  hoverUnderlineColor: color,
}))<{ isFocus: boolean }>(({ theme, isFocus }) => ({
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))

const StyledExternalTouchableLink = styled(ExternalTouchableLink).attrs<{
  color: ColorsEnum
}>(({ color }) => ({
  hoverUnderlineColor: color,
}))<{ isFocus: boolean }>(({ theme, isFocus }) => ({
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))

const StyledTouchableOpacity = styledButton(Touchable)<{
  color: ColorsEnum
}>(({ theme, color }) => ({
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ color: theme.colors.black }),
  ...getHoverStyle(color),
}))

const Container = styled.View<{ backgroundColor: ColorsEnum; borderColor: ColorsEnum }>(
  ({ theme, backgroundColor, borderColor }) => ({
    alignItems: 'center',
    backgroundColor,
    borderColor,
    borderRadius: theme.borderRadius.radius,
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
