import React, { FunctionComponent } from 'react'
import { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Typo } from 'ui/theme'

import { isStyleObjectTypeGuard } from '../typeguards'

interface AppButtonProps {
  title: string
  buttonTheme: AppButtonTheme
  customStyles?: AppButtonStyleClasses
  disabled?: boolean
  icon?: FunctionComponent<IconInterface>
  iconColor?: ColorsEnum
  iconSize?: number
  onLongPress?: ((e: GestureResponderEvent) => void) | (() => void)
  onPress?: ((e: GestureResponderEvent) => void) | (() => void)
}

export const AppButton: FunctionComponent<AppButtonProps> = (props) => {
  const Icon = props.icon
  const iconTheme = AppButtonThemesConfiguration[props.buttonTheme].icon
  const pressHandler = props.disabled ? undefined : props.onPress
  const longPressHandler = props.disabled ? undefined : props.onLongPress

  return (
    <Container
      buttonTheme={props.buttonTheme}
      customStyle={props.customStyles?.container}
      disabled={props.disabled}
      onPress={pressHandler}
      onLongPress={longPressHandler}>
      {Icon && (
        <IconContainer>
          <Icon
            color={props.iconColor || iconTheme?.color}
            size={props.iconSize || iconTheme?.size}
          />
        </IconContainer>
      )}
      <Title buttonTheme={props.buttonTheme} customStyle={props.customStyles?.title}>
        {props.title}
      </Title>
    </Container>
  )
}

export enum AppButtonTheme {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
}

interface CustomizableProps {
  customStyle: StyleProp<TextStyle>
  buttonTheme: AppButtonTheme
  disabled?: boolean
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.3,
}))<CustomizableProps>(({ customStyle, buttonTheme, disabled }) => {
  const theme = AppButtonThemesConfiguration[buttonTheme].background as ViewStyle
  return {
    opacity: disabled ? 0.3 : 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...(isStyleObjectTypeGuard(theme) ? theme : null),
    ...(isStyleObjectTypeGuard(customStyle) ? customStyle : null),
  }
})

const Title = styled(Typo.ButtonText)(({ customStyle, buttonTheme }: CustomizableProps) => {
  const theme = AppButtonThemesConfiguration?.[buttonTheme]?.title as TextStyle
  return {
    ...(isStyleObjectTypeGuard(theme) ? theme : null),
    ...(isStyleObjectTypeGuard(customStyle) ? customStyle : null),
  }
})

const IconContainer = styled.View({
  marginRight: 10,
})

export interface AppButtonStyleClasses {
  container?: ViewStyle
  title?: TextStyle
}

export const AppButtonThemesConfiguration: {
  [theme in AppButtonTheme]: {
    title?: TextStyle & {
      color?: ColorsEnum
    }
    background?: ViewStyle & {
      backgroundColor?: ColorsEnum
    }
    icon?: ViewStyle & {
      color?: ColorsEnum
      size?: number
    }
  }
} = {
  [AppButtonTheme.PRIMARY]: {
    title: {
      color: ColorsEnum.WHITE,
    },
    background: {
      backgroundColor: ColorsEnum.PRIMARY,
      borderRadius: 24,
      padding: 10,
    },
    icon: {
      color: ColorsEnum.WHITE,
      size: 20,
    },
  },
  [AppButtonTheme.SECONDARY]: {
    title: {
      color: ColorsEnum.PRIMARY,
    },
    background: {
      borderRadius: 24,
      borderWidth: 2,
      borderColor: ColorsEnum.PRIMARY,
      padding: 10,
    },
    icon: {
      color: ColorsEnum.PRIMARY,
      size: 20,
    },
  },
  [AppButtonTheme.TERTIARY]: {
    title: {
      color: ColorsEnum.PRIMARY,
    },
    background: {
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderRadius: 24,
      padding: 10,
    },
    icon: {
      color: ColorsEnum.PRIMARY,
      size: 20,
    },
  },
  [AppButtonTheme.QUATERNARY]: {
    title: {
      color: ColorsEnum.PRIMARY,
      fontSize: 14,
      fontFamily: 'Montserrat-SemiBold',
    },
    background: {
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderRadius: 24,
      padding: 12,
    },
    icon: {
      color: ColorsEnum.PRIMARY,
      size: 20,
    },
  },
}
