import React, { Fragment, FunctionComponent, memo } from 'react'
import { GestureResponderEvent, StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { Logo } from 'ui/svg/icons/Logo'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
import { BorderRadiusEnum } from 'ui/theme/grid'

export interface BaseButtonProps {
  accessibilityLabel?: string
  adjustsFontSizeToFit?: boolean
  buttonHeight?: 'small' | 'tall'
  disabled?: boolean
  icon?: FunctionComponent<IconInterface>
  iconSize?: number
  inline?: boolean
  isLoading?: boolean
  onLongPress?: ((e: GestureResponderEvent) => void) | (() => void)
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
  testId?: string
  textLineHeight?: string
  textSize?: number
  title: string
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start'
  numberOfLines?: number
  style?: StyleProp<ViewStyle>
}

interface AppButtonProps extends BaseButtonProps {
  backgroundColor?: ColorsEnum
  borderColor?: ColorsEnum
  iconColor?: ColorsEnum
  inline?: boolean
  inlineHeight?: number
  loadingIconColor: ColorsEnum
  textColor?: ColorsEnum
}

type Only<TestedType, StandardType> = TestedType &
  Record<Exclude<keyof TestedType, keyof StandardType>, never>

const _AppButton = <T extends AppButtonProps>({
  icon: Icon,
  inline,
  disabled,
  isLoading,
  onPress,
  onLongPress,
  loadingIconColor,
  iconSize,
  iconColor,
  backgroundColor,
  fullWidth,
  borderColor,
  buttonHeight,
  inlineHeight,
  accessibilityLabel,
  testId,
  title,
  textColor,
  textSize,
  textLineHeight,
  adjustsFontSizeToFit,
  justifyContent,
  numberOfLines,
  style,
}: Only<T, AppButtonProps>) => {
  const pressHandler = disabled || isLoading ? undefined : onPress
  const longPressHandler = disabled || isLoading ? undefined : onLongPress
  return (
    <StyledTouchableOpacity
      {...accessibilityAndTestId(accessibilityLabel || title, testId || title)}
      backgroundColor={backgroundColor}
      fullWidth={fullWidth}
      borderColor={borderColor}
      onPress={pressHandler}
      onLongPress={longPressHandler}
      buttonHeight={buttonHeight ?? 'small'}
      inline={inline}
      inlineHeight={inlineHeight ?? 16}
      justifyContent={justifyContent ?? 'center'}
      numberOfLines={numberOfLines}
      style={style}>
      {isLoading ? (
        <Logo
          {...accessibilityAndTestId(undefined, 'button-isloading-icon')}
          color={loadingIconColor}
          size={iconSize}
        />
      ) : (
        <Fragment>
          {!!Icon && (
            <Icon
              {...accessibilityAndTestId(undefined, 'button-icon')}
              color={iconColor}
              size={iconSize}
            />
          )}
          <Title
            textColor={textColor}
            textSize={textSize}
            textLineHeight={textLineHeight}
            adjustsFontSizeToFit={adjustsFontSizeToFit ?? false}
            icon={Icon}
            iconSize={iconSize}
            numberOfLines={numberOfLines ?? 1}>
            {title}
          </Title>
        </Fragment>
      )}
    </StyledTouchableOpacity>
  )
}

// memo is used to avoid useless rendering while props remain unchanged
export const AppButton = memo(_AppButton)

interface StyledTouchableOpacityProps {
  backgroundColor?: ColorsEnum
  borderColor?: ColorsEnum
  buttonHeight: 'small' | 'tall'
  inline?: boolean
  inlineHeight?: number
  fullWidth?: boolean
  justifyContent?: 'center' | 'flex-start'
  numberOfLines?: number
}

const StyledTouchableOpacity = styled(TouchableOpacity).attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))<StyledTouchableOpacityProps>(
  ({
    inline,
    backgroundColor,
    borderColor,
    buttonHeight,
    inlineHeight,
    fullWidth,
    justifyContent,
    numberOfLines,
    theme,
  }) => ({
    flexDirection: 'row',
    justifyContent: justifyContent === 'flex-start' ? 'flex-start' : 'center',
    alignItems: 'center',
    borderRadius: BorderRadiusEnum.BUTTON,
    padding: 2,
    backgroundColor,
    borderColor,
    borderWidth: borderColor ? 2 : 0,
    height: buttonHeight === 'tall' ? getSpacing(12) : getSpacing(10),
    width: '100%',
    ...(fullWidth ? {} : { maxWidth: theme.desktopCenteredContentMaxWidth }),
    ...(inline
      ? {
          borderWidth: 0,
          borderRadius: 0,
          marginTop: 0,
          padding: 0,
          width: 'auto',
          height: inlineHeight,
        }
      : {}),
    ...(justifyContent === 'flex-start' ? { paddingRight: 0, paddingLeft: 0 } : {}),
    ...(numberOfLines ? { height: 'auto' } : {}),
  })
)

interface TitleProps {
  textColor?: ColorsEnum
  textSize?: number
  textLineHeight?: string
  icon?: React.FC<IconInterface>
  iconSize?: number
}

const Title = styled(Typo.ButtonText)<TitleProps>((props) => ({
  maxWidth: '100%',
  color: props.textColor,
  fontSize: props.textSize,
  lineHeight: props.textLineHeight,
  marginLeft: props.icon ? getSpacing(3) : 0,
}))
