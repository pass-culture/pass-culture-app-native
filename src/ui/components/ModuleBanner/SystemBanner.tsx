import React, { FunctionComponent, useEffect } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics/provider'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { theme } from 'theme'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, TypoDS } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

type Props = {
  leftIcon: React.FunctionComponent<AccessibleIcon>
  title: string
  subtitle: string
  onPress: VoidFunction
  accessibilityLabel: string
  analyticsParams: {
    type: 'credit' | 'location'
    from: 'home' | 'thematicHome' | 'offer' | 'profile' | 'search'
  }
}

export const SystemBanner: FunctionComponent<Props & { withBackground?: boolean }> = ({
  leftIcon: LeftIcon,
  title,
  subtitle,
  onPress,
  accessibilityLabel,
  analyticsParams: { type, from },
  withBackground = false,
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

  return (
    <StyledTouchable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      color={color}
      {...focusProps}>
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
    </StyledTouchable>
  )
}

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

const StyledTouchable = styledButton(Touchable)<{
  isFocus?: boolean
  isHover?: boolean
  color: ColorsEnum
}>(({ theme, isFocus, color }) => ({
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color }),
}))

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
