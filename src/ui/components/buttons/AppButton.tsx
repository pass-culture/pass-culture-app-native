import React, { Fragment, FunctionComponent, memo } from 'react'
import { Dimensions, GestureResponderEvent } from 'react-native'
import styled from 'styled-components/native'

import { Logo } from 'ui/svg/icons/Logo'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

export interface BaseButtonProps {
  title: string
  disabled?: boolean
  isLoading?: boolean
  icon?: FunctionComponent<IconInterface>
  onLongPress?: ((e: GestureResponderEvent) => void) | (() => void)
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
}

export interface AppButtonProps extends BaseButtonProps {
  loadingIconColor: ColorsEnum
  iconColor?: ColorsEnum
  iconSize?: number
  textColor?: ColorsEnum
  textSize?: number
  backgroundColor?: ColorsEnum
  borderColor?: ColorsEnum
}

type Only<TestedType, StandardType> = TestedType &
  Record<Exclude<keyof TestedType, keyof StandardType>, never>

const _AppButton = <T extends AppButtonProps>(props: Only<T, AppButtonProps>) => {
  const Icon = props.icon
  const pressHandler = props.disabled || props.isLoading ? undefined : props.onPress
  const longPressHandler = props.disabled || props.isLoading ? undefined : props.onLongPress

  return (
    <Container
      testID="button-container"
      backgroundColor={props.backgroundColor}
      borderColor={props.borderColor}
      onPress={pressHandler}
      onLongPress={longPressHandler}>
      {props.isLoading ? (
        <Logo testID="button-isloading-icon" color={props.loadingIconColor} size={props.iconSize} />
      ) : (
        <Fragment>
          {Icon && <Icon testID="button-icon" color={props.iconColor} size={props.iconSize} />}
          <Title
            testID="button-title"
            textColor={props.textColor}
            textSize={props.textSize}
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
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))<ContainerProps>(({ backgroundColor, borderColor }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 24,
  padding: 2,
  backgroundColor,
  borderColor,
  borderWidth: borderColor ? 2 : 0,
  height: 40,
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
