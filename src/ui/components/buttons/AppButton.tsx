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
  adjustsFontSizeToFit?: boolean
  buttonHeight?: 'small' | 'tall'
  disabled?: boolean
  icon?: FunctionComponent<IconInterface>
  inline?: boolean
  isLoading?: boolean
  onLongPress?: ((e: GestureResponderEvent) => void) | (() => void)
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
  testId?: string
  textLineHeight?: number
  textSize?: number
  title: string
  fullWidth?: boolean
  style?: StyleProp<ViewStyle>
}

export interface AppButtonProps extends BaseButtonProps {
  backgroundColor?: ColorsEnum
  borderColor?: ColorsEnum
  iconColor?: ColorsEnum
  iconSize?: number
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
  testId,
  title,
  textColor,
  textSize,
  textLineHeight,
  adjustsFontSizeToFit,
  style,
}: Only<T, AppButtonProps>) => {
  const pressHandler = disabled || isLoading ? undefined : onPress
  const longPressHandler = disabled || isLoading ? undefined : onLongPress
  const containerTestID = testId ? testId : title
  return (
    <Container
      {...accessibilityAndTestId(containerTestID)}
      backgroundColor={backgroundColor}
      fullWidth={fullWidth}
      borderColor={borderColor}
      onPress={pressHandler}
      onLongPress={longPressHandler}
      buttonHeight={buttonHeight ?? 'small'}
      inline={inline}
      inlineHeight={inlineHeight ?? 16}
      style={style}>
      {isLoading ? (
        <Logo
          {...accessibilityAndTestId('button-isloading-icon')}
          color={loadingIconColor}
          size={iconSize}
        />
      ) : (
        <Fragment>
          {!!Icon && (
            <Icon {...accessibilityAndTestId('button-icon')} color={iconColor} size={iconSize} />
          )}
          <Title
            textColor={textColor}
            textSize={textSize}
            textLineHeight={textLineHeight}
            adjustsFontSizeToFit={adjustsFontSizeToFit ?? false}
            numberOfLines={1}>
            {title}
          </Title>
        </Fragment>
      )}
    </Container>
  )
}

// memo is used to avoid useless rendering while props remain unchanged
export const AppButton = memo(_AppButton)

interface ContainerProps {
  backgroundColor?: ColorsEnum
  borderColor?: ColorsEnum
  buttonHeight: 'small' | 'tall'
  inline?: boolean
  inlineHeight?: number
  fullWidth?: boolean
}

const Container = styled(TouchableOpacity).attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))<ContainerProps>(
  ({ inline, backgroundColor, borderColor, buttonHeight, inlineHeight, fullWidth }) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadiusEnum.BUTTON,
    paddingBottom: 2,
    paddingRight: 2,
    paddingTop: 2,
    paddingLeft: 2,
    backgroundColor,
    borderColor,
    borderWidth: borderColor ? 2 : 0,
    height: buttonHeight === 'tall' ? getSpacing(12) : getSpacing(10),
    width: '100%',
    ...(fullWidth ? {} : { maxWidth: getSpacing(125) }),
    ...(inline
      ? {
          borderWidth: 0,
          borderRadius: 0,
          marginTop: 0,
          paddingBottom: 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          width: 'auto',
          height: inlineHeight,
        }
      : {}),
  })
)

interface TitleProps {
  textColor?: ColorsEnum
  textSize?: number
  textLineHeight?: number
}

const Title = styled(Typo.ButtonText)<TitleProps>((props) => ({
  maxWidth: '100%',
  color: props.textColor,
  fontSize: props.textSize,
  lineHeight: props.textLineHeight,
  marginLeft: 5,
}))
