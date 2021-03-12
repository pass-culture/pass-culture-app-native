import React, { Fragment, FunctionComponent, memo } from 'react'
import { Dimensions, GestureResponderEvent } from 'react-native'
import styled from 'styled-components/native'

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
  testIdSuffix?: string
  textSize?: number
  title: string
}

export interface AppButtonProps extends BaseButtonProps {
  backgroundColor?: ColorsEnum
  borderColor?: ColorsEnum
  iconColor?: ColorsEnum
  iconSize?: number
  inline?: boolean
  loadingIconColor: ColorsEnum
  textColor?: ColorsEnum
}

type Only<TestedType, StandardType> = TestedType &
  Record<Exclude<keyof TestedType, keyof StandardType>, never>

const _AppButton = <T extends AppButtonProps>(props: Only<T, AppButtonProps>) => {
  const Icon = props.icon
  const inline = props.inline
  const pressHandler = props.disabled || props.isLoading ? undefined : props.onPress
  const longPressHandler = props.disabled || props.isLoading ? undefined : props.onLongPress
  const titleTestID = props.testIdSuffix ? `button-title-${props.testIdSuffix}` : 'button-title'
  const containerTestID = props.testIdSuffix
    ? `button-container-${props.testIdSuffix}`
    : 'button-container'

  return (
    <Container
      testID={containerTestID}
      backgroundColor={props.backgroundColor}
      borderColor={props.borderColor}
      onPress={pressHandler}
      onLongPress={longPressHandler}
      buttonHeight={props.buttonHeight ?? 'small'}
      inline={inline}>
      {props.isLoading ? (
        <Logo testID="button-isloading-icon" color={props.loadingIconColor} size={props.iconSize} />
      ) : (
        <Fragment>
          {Icon && <Icon testID="button-icon" color={props.iconColor} size={props.iconSize} />}
          <Title
            testID={titleTestID}
            textColor={props.textColor}
            textSize={props.textSize}
            adjustsFontSizeToFit={props.adjustsFontSizeToFit ?? false}
            numberOfLines={1}>
            {props.title}
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
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: ACTIVE_OPACITY,
}))<ContainerProps>(({ inline, backgroundColor, borderColor, buttonHeight }) => ({
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
  maxWidth: getSpacing(125),
  ...(inline
    ? {
        borderWidth: 0,
        borderRadius: 0,
        marginTop: 0,
        paddingBottom: 0,
        paddingTop: 0,
        paddingRight: 5,
        paddingLeft: 5,
        width: 'auto',
        height: 16,
      }
    : {}),
}))

interface TitleProps {
  textColor?: ColorsEnum
  textSize?: number
}

const Title = styled(Typo.ButtonText)<TitleProps>(({ textColor, textSize }) => ({
  maxWidth: Dimensions.get('screen').width - getSpacing(25),
  color: textColor,
  fontSize: textSize,
  marginLeft: 5,
}))
