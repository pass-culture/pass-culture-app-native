import React, { FunctionComponent } from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, Typo } from 'ui/theme'

import { isStyleObject } from '../typeguards'

export enum AppButtonTheme {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
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

interface AppButtonProps {
  title: string
  buttonTheme: AppButtonTheme
  customStyles?: AppButtonStyleClasses
  icon?: FunctionComponent<IconInterface>
  iconColor?: ColorsEnum
  iconSize?: number
}

export const AppButton: FunctionComponent<AppButtonProps> = ({
  title,
  buttonTheme,
  customStyles,
  icon: Icon,
  iconColor,
  iconSize,
}) => {
  const iconTheme = AppButtonThemesConfiguration?.[buttonTheme]?.icon

  return (
    <Container buttonTheme={buttonTheme} customStyle={customStyles?.container}>
      {Icon && (
        <IconContainer>
          <Icon color={iconColor || iconTheme?.color} size={iconSize || iconTheme?.size} />
        </IconContainer>
      )}
      <Title buttonTheme={buttonTheme} customStyle={customStyles?.title}>
        {title}
      </Title>
    </Container>
  )
}

interface CustomizableProps {
  customStyle: StyleProp<TextStyle>
  buttonTheme: AppButtonTheme
}

const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.3,
}))<CustomizableProps>(({ customStyle, buttonTheme }) => {
  const theme = AppButtonThemesConfiguration?.[buttonTheme]?.background as ViewStyle
  return {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...(isStyleObject(theme) ? theme : null),
    ...(isStyleObject(customStyle) ? customStyle : null),
  }
})

const Title = styled(Typo.ButtonText)(({ customStyle, buttonTheme }: CustomizableProps) => {
  const theme = AppButtonThemesConfiguration?.[buttonTheme]?.title as TextStyle
  return {
    ...(isStyleObject(theme) ? theme : null),
    ...(isStyleObject(customStyle) ? customStyle : null),
  }
})

const IconContainer = styled.View({
  marginRight: 10,
})

export interface AppButtonStyleClasses {
  container?: ViewStyle
  title?: TextStyle
}
