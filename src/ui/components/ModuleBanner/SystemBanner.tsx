import React, { FunctionComponent, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { theme } from 'theme'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type TouchableProps =
  | {
      navigateTo: InternalNavigationProps['navigateTo']
      onBeforeNavigate?: () => void
    }
  | {
      onPress: () => void
    }

type Props = TouchableProps & {
  leftIcon: React.FunctionComponent<AccessibleIcon>
  title: string
  subtitle: string
  onPress: VoidFunction
  accessibilityLabel: string
  accessibilityRole?: AccessibilityRole
  analyticsParams: {
    type: 'credit' | 'location' | 'remoteActivationBanner' | 'remoteGenericBanner'
    from: 'Home' | 'ThematicHome' | 'Offer' | 'Profile' | 'Search' | 'Cheatcodes'
  }
  withBackground?: boolean
}

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

  const color = withBackground ? theme.colors.white : theme.colors.black
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

  const TouchableComponent =
    'navigateTo' in touchableProps ? StyledInternalTouchableLink : StyledTouchableOpacity

  return (
    <TouchableComponent
      {...touchableProps}
      {...focusProps}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      color={color}>
      <Container backgroundColor={backgroundColor} borderColor={borderColor} testID="systemBanner">
        {StyledIcon ? (
          <IconContainer>
            <StyledIcon />
          </IconContainer>
        ) : null}
        <DescriptionContainer gap={1}>
          <StyledBodyAccent color={color}>{title}</StyledBodyAccent>
          <StyledBody color={color}>{subtitle}</StyledBody>
        </DescriptionContainer>
        <View>
          <StyledArrowNextIcon color={iconColor} />
        </View>
      </Container>
    </TouchableComponent>
  )
}

const StyledInternalTouchableLink = styled(InternalTouchableLink)<{ color: ColorsEnum }>(
  ({ theme, color }) => ({
    borderRadius: theme.borderRadius.radius,
    ...customFocusOutline({ color }),
    ...getHoverStyle(color),
  })
)

const StyledTouchableOpacity = styledButton(TouchableOpacity)<{
  color: ColorsEnum
}>(({ theme, color }) => ({
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ color }),
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

const StyledBodyAccent = styled(TypoDS.BodyAccent)<{ color?: ColorsEnum }>(({ color }) => ({
  color,
}))

const StyledBody = styled(TypoDS.Body)<{ color?: ColorsEnum }>(({ color }) => ({
  color,
}))
