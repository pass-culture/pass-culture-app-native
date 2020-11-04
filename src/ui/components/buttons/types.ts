import { TextStyle, ViewStyle } from 'react-native'

import { ColorsEnum } from 'ui/theme'

export enum AppButtonTheme {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
}

export const AppButtonThemesConfiguration: {
  [theme in AppButtonTheme]: {
    title: TextStyle
    disabledTitle?: TextStyle
    container: ViewStyle
    disabledContainer: ViewStyle
    isLoadingContainer: ViewStyle
    icon: {
      color: ColorsEnum
      size: number
    }
    disabledIcon?: {
      color: ColorsEnum
    }
  }
} = {
  [AppButtonTheme.PRIMARY]: {
    title: {
      color: ColorsEnum.WHITE,
      margin: 6,
    },
    container: {
      backgroundColor: ColorsEnum.PRIMARY,
      borderRadius: 24,
      padding: 4,
    },
    disabledContainer: {
      backgroundColor: ColorsEnum.PRIMARY_DISABLED,
    },
    isLoadingContainer: {
      backgroundColor: ColorsEnum.PRIMARY_DARK,
    },
    icon: {
      color: ColorsEnum.WHITE,
      size: 32,
    },
  },
  [AppButtonTheme.SECONDARY]: {
    title: {
      color: ColorsEnum.PRIMARY,
      margin: 6,
    },
    disabledTitle: {
      color: ColorsEnum.PRIMARY_DISABLED,
    },
    container: {
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: ColorsEnum.PRIMARY,
      padding: 2,
    },
    disabledContainer: {
      borderColor: ColorsEnum.PRIMARY_DISABLED,
    },
    isLoadingContainer: {
      borderColor: ColorsEnum.PRIMARY_DARK,
    },
    icon: {
      color: ColorsEnum.PRIMARY,
      size: 32,
    },
    disabledIcon: {
      color: ColorsEnum.PRIMARY_DISABLED,
    },
  },
  [AppButtonTheme.TERTIARY]: {
    title: {
      color: ColorsEnum.PRIMARY,
      margin: 6,
    },
    disabledTitle: {
      color: ColorsEnum.PRIMARY_DISABLED,
    },
    container: {
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderRadius: 24,
      padding: 4,
    },
    disabledContainer: {
      backgroundColor: ColorsEnum.TRANSPARENT,
    },
    isLoadingContainer: {
      backgroundColor: ColorsEnum.TRANSPARENT,
    },
    icon: {
      color: ColorsEnum.PRIMARY,
      size: 32,
    },
    disabledIcon: {
      color: ColorsEnum.PRIMARY_DISABLED,
    },
  },
  [AppButtonTheme.QUATERNARY]: {
    title: {
      color: ColorsEnum.PRIMARY,
      fontSize: 14,
      fontFamily: 'Montserrat-SemiBold',
      margin: 6,
    },
    disabledTitle: {
      color: ColorsEnum.PRIMARY_DISABLED,
    },
    container: {
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderRadius: 24,
      padding: 4,
    },
    disabledContainer: {
      backgroundColor: ColorsEnum.TRANSPARENT,
    },
    isLoadingContainer: {
      backgroundColor: ColorsEnum.TRANSPARENT,
    },
    icon: {
      color: ColorsEnum.PRIMARY,
      size: 20,
    },
    disabledIcon: {
      color: ColorsEnum.PRIMARY_DISABLED,
    },
  },
}
