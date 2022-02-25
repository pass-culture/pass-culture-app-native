import { Platform } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb, isTabletDeviceDetectOnWeb } from 'libs/react-device-detect'
import { getSpacing, getSpacingString } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { buttonHeights, ButtonHeightsType } from 'ui/theme/buttonHeights'
// eslint-disable-next-line no-restricted-imports
import { ACTIVE_OPACITY, ColorsEnum, UniqueColors } from 'ui/theme/colors'
import {
  BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET,
  DESKTOP_CONTENT_MAX_WIDTH,
  DESKTOP_CONTENT_MEDIUM_WIDTH,
  TAB_BAR_COMP_HEIGHT,
} from 'ui/theme/constants'
import { BorderRadiusEnum, Breakpoints } from 'ui/theme/grid'
import { IconSizesType, iconSizes } from 'ui/theme/iconSizes'
import { IllustrationSizesType, illustrationSizes } from 'ui/theme/illustrationSizes'
// eslint-disable-next-line no-restricted-imports
import { ZIndex } from 'ui/theme/layers'

const isNative = Platform.OS === 'ios' || Platform.OS === 'android'
const isTouchWeb = Platform.OS === 'web' && (isMobileDeviceDetectOnWeb || isTabletDeviceDetectOnWeb)
const isTouch = isNative || isTouchWeb

interface Typography {
  fontFamily: string
  fontSize: number
  lineHeight: string
  fontWeight?: number
}

export interface AppThemeType {
  appContentWidth: number
  appBarHeight: number
  navTopHeight: number
  tabBarHeight: number
  isMobileViewport?: boolean // computed dynamically in ThemeProvider.tsx
  isTabletViewport?: boolean // computed dynamically in ThemeProvider.tsx
  isDesktopViewport?: boolean // computed dynamically in ThemeProvider.tsx
  isTouch: boolean
  showTabBar: boolean // computed dynamically in ThemeProvider.tsx
  activeOpacity: number
  forms: { maxWidth: number }
  fontFamily: {
    medium: string
    black: string
    bold: string
    regular: string
    semiBold: string
  }
  outline: {
    width: number
    color: ColorsEnum
    style: string
  }
  typography: {
    hero: Typography
    title1: Typography
    title2: Typography
    title3: Typography
    title4: Typography
    buttonText: Typography
    body: Typography
    caption: Typography
  }
  colors: {
    accent: ColorsEnum
    attention: ColorsEnum
    black: ColorsEnum
    error: ColorsEnum
    greenValid: ColorsEnum
    greenLight: ColorsEnum
    greyDark: ColorsEnum
    greyMedium: ColorsEnum
    greyLight: ColorsEnum
    primary: ColorsEnum
    primaryDisabled: ColorsEnum
    primaryDark: ColorsEnum
    secondary: ColorsEnum
    tertiary: ColorsEnum
    transparent: ColorsEnum
    white: ColorsEnum
  }
  uniqueColors: {
    tabBar: UniqueColors
    greyOverlay: UniqueColors
    filterButton: UniqueColors
    backgroundColor: UniqueColors
    foregroundColor: UniqueColors
    brand: UniqueColors
    brandDark: UniqueColors
    greyDisabled: UniqueColors
    greenDisabled: UniqueColors
  }
  breakpoints: {
    xs: Breakpoints
    sm: Breakpoints
    md: Breakpoints
    lg: Breakpoints
    xl: Breakpoints
    xxl: Breakpoints
  }
  borderRadius: {
    button: BorderRadiusEnum
    radius: BorderRadiusEnum
    checkbox: BorderRadiusEnum
  }
  zIndex: {
    background: ZIndex
    cheatCodeButton: ZIndex
    favoritePastilleContent: ZIndex
    homeOfferCoverIcons: ZIndex
    header: ZIndex
    modalHeader: ZIndex
    progressbar: ZIndex
    playlistsButton: ZIndex
    progressbarIcon: ZIndex
    tabBar: ZIndex
    headerNav: ZIndex
    snackbar: ZIndex
  }
  contentPage: {
    mediumWidth: number
    maxWidth: number
    bottom: { offsetTopHeightDesktopTablet: number }
  }
  icons: { sizes: IconSizesType }
  illustrations: { sizes: IllustrationSizesType }
  buttons: {
    maxWidth: number
    buttonHeights: ButtonHeightsType
    loading: {
      primary: {
        backgroundColor: ColorsEnum
      }
      secondary: {
        borderColor: ColorsEnum
      }
      secondaryWhite: {
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
      secondaryWhite: {
        borderColor: ColorsEnum
        textColor: ColorsEnum
        iconColor: ColorsEnum
      }
      tertiary: {
        textColor: ColorsEnum
        iconColor: ColorsEnum
      }
      tertiaryBlack: {
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
      quaternaryBlack: {
        iconColor: ColorsEnum
        textColor: ColorsEnum
      }
    }
    primary: {
      marginLeft: number
      marginLeftWithIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor?: ColorsEnum
    }
    primaryWhite: {
      marginLeft: number
      marginLeftWithIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
    }
    secondary: {
      marginLeft: number
      marginLeftWithIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      borderColor: ColorsEnum
      borderWidth: number
    }
    secondaryWhite: {
      marginLeft: number
      marginLeftWithIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      borderColor: ColorsEnum
      borderWidth: number
    }
    tertiary: {
      marginLeft: number
      marginLeftWithIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
    }
    tertiaryBlack: {
      marginLeft: number
      marginLeftWithIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
    }
    tertiaryWhite: {
      marginLeft: number
      marginLeftWithIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
    }
    tertiaryGreyDark: {
      marginLeft: number
      marginLeftWithIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
    }
    quaternary: {
      marginLeft: number
      marginLeftWithIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
    }
    quaternaryBlack: {
      marginLeft: number
      marginLeftWithIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
    }
    linearGradient: {
      iconSize: number
      iconColor: ColorsEnum
    }
    scrollButton: {
      size: number
      borderWidth: number
      borderColor: ColorsEnum
      backgroundColor: ColorsEnum
    }
  }
}

export const theme: AppThemeType = {
  appContentWidth: getSpacing(100),
  appBarHeight: getSpacing(16),
  navTopHeight: getSpacing(20),
  tabBarHeight: TAB_BAR_COMP_HEIGHT,
  isTouch,
  showTabBar: true, // default value, the actual value is computed dynamically in ThemeProvider.tsx
  activeOpacity: ACTIVE_OPACITY,
  fontFamily: {
    medium: 'Montserrat-Medium',
    black: 'Montserrat-Black',
    bold: 'Montserrat-Bold',
    regular: 'Montserrat-Regular',
    semiBold: 'Montserrat-SemiBold',
  },
  forms: { maxWidth: DESKTOP_CONTENT_MAX_WIDTH },
  outline: {
    width: getSpacing(0.75),
    color: ColorsEnum.PRIMARY,
    style: 'solid',
  },
  typography: {
    hero: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getSpacing(9.5),
      lineHeight: getSpacingString(12),
    },
    title1: {
      fontFamily: 'Montserrat-Black',
      fontSize: getSpacing(6),
      lineHeight: getSpacingString(9),
    },
    title2: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getSpacing(6),
      lineHeight: getSpacingString(7),
    },
    title3: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getSpacing(5),
      lineHeight: getSpacingString(6),
    },
    title4: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getSpacing(4.5),
      lineHeight: getSpacingString(5.5),
    },
    buttonText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getSpacing(3.75),
      lineHeight: getSpacingString(5),
    },
    body: {
      fontFamily: 'Montserrat-Regular',
      fontSize: getSpacing(3.75),
      lineHeight: getSpacingString(5),
    },
    caption: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: getSpacing(3),
      lineHeight: getSpacingString(4),
    },
  },
  colors: {
    accent: ColorsEnum.ACCENT,
    attention: ColorsEnum.ATTENTION,
    black: ColorsEnum.BLACK,
    error: ColorsEnum.ERROR,
    greenValid: ColorsEnum.GREEN_VALID,
    greenLight: ColorsEnum.GREEN_LIGHT,
    greyDark: ColorsEnum.GREY_DARK,
    greyMedium: ColorsEnum.GREY_MEDIUM,
    greyLight: ColorsEnum.GREY_LIGHT,
    primary: ColorsEnum.PRIMARY,
    primaryDisabled: ColorsEnum.PRIMARY_DISABLED,
    primaryDark: ColorsEnum.PRIMARY_DARK,
    secondary: ColorsEnum.SECONDARY,
    tertiary: ColorsEnum.TERTIARY,
    transparent: ColorsEnum.TRANSPARENT,
    white: ColorsEnum.WHITE,
  },
  uniqueColors: {
    tabBar: UniqueColors.TAB_BAR,
    greyOverlay: UniqueColors.GREY_OVERLAY,
    filterButton: UniqueColors.FILTER_BUTTON,
    backgroundColor: UniqueColors.BACKGROUND_COLOR,
    foregroundColor: UniqueColors.FOREGROUND_COLOR,
    brand: UniqueColors.BRAND,
    brandDark: UniqueColors.BRAND_DARK,
    greyDisabled: UniqueColors.GREY_DISABLED,
    greenDisabled: UniqueColors.GREEN_DISABLED,
  },
  breakpoints: {
    xs: Breakpoints.XS,
    sm: Breakpoints.SM,
    md: Breakpoints.MD,
    lg: Breakpoints.LG,
    xl: Breakpoints.XL,
    xxl: Breakpoints.XXL,
  },
  borderRadius: {
    button: BorderRadiusEnum.BUTTON,
    radius: BorderRadiusEnum.BORDER_RADIUS,
    checkbox: BorderRadiusEnum.CHECKBOX_RADIUS,
  },
  zIndex: {
    background: ZIndex.BACKGROUND,
    cheatCodeButton: ZIndex.CHEAT_CODE_BUTTON,
    favoritePastilleContent: ZIndex.FAVORITE_PASTILLE_CONTENT,
    homeOfferCoverIcons: ZIndex.HOME_OFFER_COVER_ICONS,
    header: ZIndex.HEADER,
    modalHeader: ZIndex.MODAL_HEADER,
    progressbar: ZIndex.PROGRESSBAR,
    playlistsButton: ZIndex.PLAYLIST_BUTTON,
    progressbarIcon: ZIndex.PROGRESSBAR_ICON,
    tabBar: ZIndex.TAB_BAR,
    headerNav: ZIndex.HEADER_NAV,
    snackbar: ZIndex.SNACKBAR,
  },
  contentPage: {
    mediumWidth: DESKTOP_CONTENT_MEDIUM_WIDTH,
    maxWidth: DESKTOP_CONTENT_MAX_WIDTH,
    bottom: { offsetTopHeightDesktopTablet: BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET },
  },
  icons: { sizes: iconSizes },
  illustrations: { sizes: illustrationSizes },
  buttons: {
    maxWidth: DESKTOP_CONTENT_MAX_WIDTH,
    buttonHeights: {
      small: buttonHeights.small,
      tall: buttonHeights.tall,
      inline: buttonHeights.inline,
    },
    loading: {
      primary: {
        backgroundColor: ColorsEnum.PRIMARY_DARK,
      },
      secondary: {
        borderColor: ColorsEnum.PRIMARY_DARK,
      },
      secondaryWhite: {
        borderColor: ColorsEnum.PRIMARY_DARK,
      },
    },
    disabled: {
      primary: {
        backgroundColor: ColorsEnum.GREY_LIGHT,
        textColor: ColorsEnum.GREY_DARK,
      },
      primaryWhite: {
        iconColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.GREY_DARK,
      },
      secondary: {
        borderColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_DARK,
      },
      secondaryWhite: {
        borderColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_DARK,
      },
      tertiary: {
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_DARK,
      },
      tertiaryBlack: {
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_DARK,
      },
      tertiaryWhite: {
        textColor: ColorsEnum.PRIMARY_DISABLED,
        iconColor: ColorsEnum.PRIMARY_DISABLED,
      },
      tertiaryGreyDark: {
        textColor: ColorsEnum.PRIMARY_DISABLED,
        iconColor: ColorsEnum.PRIMARY_DISABLED,
      },
      quaternary: {
        iconColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.GREY_DARK,
      },
      quaternaryBlack: {
        iconColor: ColorsEnum.PRIMARY_DISABLED,
        textColor: ColorsEnum.PRIMARY_DISABLED,
      },
    },
    primary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      loadingIconColor: ColorsEnum.WHITE,
      iconColor: ColorsEnum.WHITE,
      iconSize: iconSizes.small,
      textColor: ColorsEnum.WHITE,
      backgroundColor: ColorsEnum.PRIMARY,
    },
    primaryWhite: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.PRIMARY,
      iconSize: iconSizes.small,
      textColor: ColorsEnum.PRIMARY,
      backgroundColor: ColorsEnum.WHITE,
    },
    secondary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.PRIMARY,
      iconSize: iconSizes.small,
      textColor: ColorsEnum.PRIMARY,
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderColor: ColorsEnum.PRIMARY,
      borderWidth: getSpacing(0.5),
    },
    secondaryWhite: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.WHITE,
      iconSize: iconSizes.small,
      textColor: ColorsEnum.WHITE,
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderColor: ColorsEnum.WHITE,
      borderWidth: getSpacing(0.5),
    },
    tertiary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      textColor: ColorsEnum.PRIMARY,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.PRIMARY,
      iconSize: iconSizes.smaller,
    },
    tertiaryBlack: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      textColor: ColorsEnum.BLACK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.BLACK,
      iconColor: ColorsEnum.BLACK,
      iconSize: iconSizes.smaller,
    },
    tertiaryWhite: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      textColor: ColorsEnum.WHITE,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.WHITE,
      iconColor: ColorsEnum.WHITE,
      iconSize: iconSizes.smaller,
    },
    tertiaryGreyDark: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      textColor: ColorsEnum.GREY_DARK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.GREY_DARK,
      iconColor: ColorsEnum.GREY_DARK,
      iconSize: iconSizes.smaller,
    },
    quaternary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.PRIMARY,
      iconSize: iconSizes.extraSmall,
      textColor: ColorsEnum.PRIMARY,
      backgroundColor: ColorsEnum.TRANSPARENT,
    },
    quaternaryBlack: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.BLACK,
      textColor: ColorsEnum.BLACK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      iconSize: iconSizes.extraSmall,
    },
    linearGradient: {
      iconSize: iconSizes.small,
      iconColor: ColorsEnum.WHITE,
    },
    scrollButton: {
      size: getSpacing(10),
      borderWidth: getSpacing(0.25),
      borderColor: ColorsEnum.GREY_MEDIUM,
      backgroundColor: ColorsEnum.WHITE,
    },
  },
}
