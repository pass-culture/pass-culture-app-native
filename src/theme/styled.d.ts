import 'styled-components/native'
import { ColorsEnum } from 'ui/theme'

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      black: ColorsEnum
      error: ColorsEnum
      greenValid: ColorsEnum
      greyDark: ColorsEnum
      greyMedium: ColorsEnum
      greyLight: ColorsEnumv
      primary: ColorsEnum
      white: ColorsEnum
      transparent: ColorsEnum
      primaryDisabled: ColorsEnum
      primaryDark: ColorsEnum
    }

    typography: {
      title2: {
        fontFamily: string
        fontSize: number
        lineHeight: string
      }
      title3: {
        fontFamily: string
        fontSize: number
        lineHeight: string
      }
      title4: {
        fontFamily: string
        fontSize: number
        lineHeight: string
      }
      buttonText: {
        fontFamily: string
        fontSize: number
        lineHeight: string
      }
      body: {
        fontFamily: string
        fontSize: number
        lineHeight: string
      }
      caption: {
        fontFamily: string
        fontSize: number
        lineHeight: string
      }
    }

    buttons: {
      loading: {
        primary: {
          backgroundColor: ColorsEnum
        }
        secondary: {
          borderColor: ColorsEnum
        }
      }
      disabled: {
        primary: {
          backgroundColor: ColorsEnum
          textColor: ColorsEnum
        }
        primaryWhite: {
          iconColor: ColorsEnum
          textColor: ColorsEnum
        }
        secondary: {
          borderColor: ColorsEnum
          textColor: ColorsEnum
          iconColor: ColorsEnum
        }
        tertiary: {
          textColor: ColorsEnum
          iconColor: ColorsEnum
        }
        tertiaryWhite: {
          textColor: ColorsEnum
          iconColor: ColorsEnum
        }
        tertiaryGreyDark: {
          textColor: ColorsEnum
          iconColor: ColorsEnum
        }
        quaternary: {
          iconColor: ColorsEnum
          textColor: ColorsEnum
        }
      }
      primary: {
        loadingIconColor: ColorsEnum
        iconColor: ColorsEnum
        textColor: ColorsEnum
        backgroundColor: ColorsEnum
      }
      primaryWhite: {
        loadingIconColor: ColorsEnum
        iconColor: ColorsEnum
        textColor: ColorsEnum
        backgroundColor: ColorsEnum
      }
      secondary: {
        loadingIconColor: ColorsEnum
        iconColor: ColorsEnum
        textColor: ColorsEnum
        backgroundColor: ColorsEnum
        borderColor: ColorsEnum
      }
      tertiary: {
        textColor: ColorsEnum
        backgroundColor: ColorsEnum
        loadingIconColor: ColorsEnum
        iconColor: ColorsEnum
      }
      tertiaryWhite: {
        textColor: ColorsEnum
        backgroundColor: ColorsEnum
        loadingIconColor: ColorsEnum
        iconColor: ColorsEnum
      }
      tertiaryGreyDark: {
        textColor: ColorsEnum
        backgroundColor: ColorsEnum
        loadingIconColor: ColorsEnum
        iconColor: ColorsEnum
      }
      quaternary: {
        loadingIconColor: ColorsEnum
        iconColor: ColorsEnum
        textColor: ColorsEnum
        backgroundColor: ColorsEnum
      }
    }
  }
}
