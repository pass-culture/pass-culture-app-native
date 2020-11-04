import React, { FunctionComponent, memo } from 'react'
import {
  Dimensions,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import styled from 'styled-components/native'

import { PassCulture } from 'ui/svg/icons/PassCulture'
import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Typo } from 'ui/theme'

import { isStyleObjectTypeGuard } from '../typeguards'

import { AppButtonTheme, AppButtonThemesConfiguration } from './types'

interface AppButtonProps {
  title: string
  buttonTheme: AppButtonTheme
  customStyles?: AppButtonStyleClasses
  disabled?: boolean
  icon?: FunctionComponent<IconInterface>
  iconColor?: ColorsEnum
  iconSize?: number
  isLoading?: boolean
  onLongPress?: ((e: GestureResponderEvent) => void) | (() => void)
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
}

/**
 * Themes and styles priority order:
 * - customStyle erases isLoadingTheme
 * - isLoadingTheme erases disabledTheme
 * - disabledTheme erases buttonTheme
 */
const _AppButton: FunctionComponent<AppButtonProps> = (props) => {
  const Icon = props.icon
  const iconTheme = AppButtonThemesConfiguration[props.buttonTheme].icon
  const disabledIconTheme = AppButtonThemesConfiguration[props.buttonTheme].disabledIcon

  const pressHandler = props.disabled || props.isLoading ? undefined : props.onPress
  const longPressHandler = props.disabled || props.isLoading ? undefined : props.onLongPress

  return (
    <Container
      testID="button-container"
      buttonTheme={props.buttonTheme}
      customStyle={props.customStyles?.container}
      disabled={props.disabled}
      isLoading={props.isLoading}
      onPress={pressHandler}
      onLongPress={longPressHandler}>
      {props.isLoading ? (
        <PassCulture
          testID="button-isloading-icon"
          color={props.iconColor || iconTheme?.color}
          size={props.iconSize || iconTheme?.size}
        />
      ) : (
        <>
          {Icon && (
            <View>
              <Icon
                testID="button-icon"
                color={
                  props.iconColor ||
                  (props.disabled && disabledIconTheme?.color) ||
                  iconTheme?.color
                }
                size={props.iconSize || iconTheme?.size}
              />
            </View>
          )}
          <Title
            testID="button-title"
            buttonTheme={props.buttonTheme}
            customStyle={props.customStyles?.title}
            numberOfLines={1}
            disabled={props.disabled}>
            {props.title}
          </Title>
        </>
      )}
    </Container>
  )
}

// memo is used to avoid useless rendering while props remain unchanged
export const AppButton = memo(_AppButton)

interface CustomizableProps {
  customStyle: StyleProp<TextStyle>
  buttonTheme: AppButtonTheme
  disabled?: boolean
  isLoading?: boolean
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.7,
}))<CustomizableProps>(({ customStyle, buttonTheme, disabled, isLoading }) => {
  const containerTheme = AppButtonThemesConfiguration[buttonTheme].container as ViewStyle
  const disabledContainerTheme = AppButtonThemesConfiguration[buttonTheme]
    .disabledContainer as ViewStyle
  const isLoadingContainerTheme = AppButtonThemesConfiguration[buttonTheme]
    .isLoadingContainer as ViewStyle

  return {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...(isStyleObjectTypeGuard(containerTheme) ? containerTheme : null),
    ...(disabled && isStyleObjectTypeGuard(disabledContainerTheme) ? disabledContainerTheme : null),
    ...(isLoading && isStyleObjectTypeGuard(isLoadingContainerTheme)
      ? isLoadingContainerTheme
      : null),
    ...(isStyleObjectTypeGuard(customStyle) ? customStyle : null),
  }
})

const Title = styled(Typo.ButtonText)(
  ({ customStyle, buttonTheme, disabled }: CustomizableProps) => {
    const theme = AppButtonThemesConfiguration?.[buttonTheme]?.title as TextStyle
    const disabledTheme = AppButtonThemesConfiguration?.[buttonTheme]?.disabledTitle as TextStyle

    return {
      maxWidth: Dimensions.get('screen').width - 100,
      ...(isStyleObjectTypeGuard(theme) ? theme : null),
      ...(disabled && isStyleObjectTypeGuard(disabledTheme) ? disabledTheme : null),
      ...(isStyleObjectTypeGuard(customStyle) ? customStyle : null),
    }
  }
)

export interface AppButtonStyleClasses {
  container?: ViewStyle
  title?: TextStyle
}
