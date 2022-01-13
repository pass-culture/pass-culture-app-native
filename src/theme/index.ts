import { Platform } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb, isTabletDeviceDetectOnWeb } from 'libs/react-device-detect'
import {
  BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET,
  getSpacing,
  getSpacingString,
  SM_ICON_SIZE,
  XS_SMALLER_ICON_SIZE,
  XXS_SMALLER_ICON_SIZE,
  STANDARD_ICON_SIZE,
  TAB_BAR_COMP_HEIGHT,
} from 'ui/theme'
import { ACTIVE_OPACITY, ColorsEnum, UniqueColors } from 'ui/theme/colors'
import { BorderRadiusEnum, Breakpoints } from 'ui/theme/grid'
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
  fontFamily: {
    medium: string
    black: string
    bold: string
    regular: string
    semiBold: string
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
    greenDisabled: UniqueColors
    greenLight: ColorsEnum
    greyDark: ColorsEnum
    greyMedium: ColorsEnum
    greyDisabled: UniqueColors
    greyLight: ColorsEnum
    primary: ColorsEnum
    primaryDisabled: ColorsEnum
    primaryDark: ColorsEnum
    secondary: ColorsEnum
    tertiary: ColorsEnum
    transparent: ColorsEnum
    white: ColorsEnum
    brand: UniqueColors
    brandDark: UniqueColors
  }
  uniqueColors: {
    tabBar: UniqueColors
    greyOverlay: UniqueColors
    filterButton: UniqueColors
    backgroundColor: UniqueColors
    foregroundColor: UniqueColors
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
  bottomContentPage: {
    offsetTopHeightDesktopTablet: number
  }
  icon: {
    color: ColorsEnum
    size: number
  }
  buttons: {
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
      tertiaryWhite: {
        textColor: ColorsEnum
        iconColor: ColorsEnum
      }
      tertiaryBlack: {
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
      marginLeftIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor?: ColorsEnum
    }
    primaryWhite: {
      marginLeft: number
      marginLeftIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
    }
    secondary: {
      marginLeft: number
      marginLeftIcon: number
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
      marginLeftIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      borderColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      borderWidth: number
    }
    tertiary: {
      marginLeft: number
      marginLeftIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
    }
    tertiaryWhite: {
      marginLeft: number
      marginLeftIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
    }
    tertiaryGreyDark: {
      marginLeft: number
      marginLeftIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
    }
    tertiaryBlack: {
      marginLeft: number
      marginLeftIcon: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
    }
    quaternary: {
      marginLeft: number
      marginLeftIcon: number
      loadingIconColor: ColorsEnum
      iconColor: ColorsEnum
      iconSize: number
      textColor: ColorsEnum
      backgroundColor: ColorsEnum
    }
    quaternaryBlack: {
      marginLeft: number
      marginLeftIcon: number
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
    greenDisabled: UniqueColors.GREEN_DISABLED,
    greenLight: ColorsEnum.GREEN_LIGHT,
    greyDark: ColorsEnum.GREY_DARK,
    greyMedium: ColorsEnum.GREY_MEDIUM,
    greyDisabled: UniqueColors.GREY_DISABLED,
    greyLight: ColorsEnum.GREY_LIGHT,
    primary: ColorsEnum.PRIMARY,
    primaryDisabled: ColorsEnum.PRIMARY_DISABLED,
    primaryDark: ColorsEnum.PRIMARY_DARK,
    secondary: ColorsEnum.SECONDARY,
    tertiary: ColorsEnum.TERTIARY,
    transparent: ColorsEnum.TRANSPARENT,
    white: ColorsEnum.WHITE,
    brand: UniqueColors.BRAND,
    brandDark: UniqueColors.BRAND_DARK,
  },
  uniqueColors: {
    tabBar: UniqueColors.TAB_BAR,
    greyOverlay: UniqueColors.GREY_OVERLAY,
    filterButton: UniqueColors.FILTER_BUTTON,
    backgroundColor: UniqueColors.BACKGROUND_COLOR,
    foregroundColor: UniqueColors.FOREGROUND_COLOR,
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
  bottomContentPage: {
    offsetTopHeightDesktopTablet: BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET,
  },
  icon: {
    color: ColorsEnum.BLACK,
    size: STANDARD_ICON_SIZE,
  },
  buttons: {
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
      tertiaryWhite: {
        textColor: ColorsEnum.PRIMARY_DISABLED,
        iconColor: ColorsEnum.PRIMARY_DISABLED,
      },
      tertiaryGreyDark: {
        textColor: ColorsEnum.PRIMARY_DISABLED,
        iconColor: ColorsEnum.PRIMARY_DISABLED,
      },
      tertiaryBlack: {
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_DARK,
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
      marginLeftIcon: getSpacing(2),
      loadingIconColor: ColorsEnum.WHITE,
      iconColor: ColorsEnum.WHITE,
      iconSize: SM_ICON_SIZE,
      textColor: ColorsEnum.WHITE,
      backgroundColor: ColorsEnum.PRIMARY,
    },
    primaryWhite: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(2),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.PRIMARY,
      iconSize: SM_ICON_SIZE,
      textColor: ColorsEnum.PRIMARY,
      backgroundColor: ColorsEnum.WHITE,
    },
    secondary: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(2),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.PRIMARY,
      iconSize: SM_ICON_SIZE,
      textColor: ColorsEnum.PRIMARY,
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderColor: ColorsEnum.PRIMARY,
      borderWidth: getSpacing(0.5),
    },
    secondaryWhite: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(2),
      textColor: ColorsEnum.WHITE,
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderColor: ColorsEnum.WHITE,
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.WHITE,
      iconSize: SM_ICON_SIZE,
      borderWidth: getSpacing(0.5),
    },
    tertiary: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(2),
      textColor: ColorsEnum.PRIMARY,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.PRIMARY,
      iconSize: XS_SMALLER_ICON_SIZE,
    },
    tertiaryWhite: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(2),
      textColor: ColorsEnum.WHITE,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.WHITE,
      iconColor: ColorsEnum.WHITE,
      iconSize: XS_SMALLER_ICON_SIZE,
    },
    tertiaryGreyDark: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(2),
      textColor: ColorsEnum.GREY_DARK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.GREY_DARK,
      iconColor: ColorsEnum.GREY_DARK,
      iconSize: XS_SMALLER_ICON_SIZE,
    },
    tertiaryBlack: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(2),
      textColor: ColorsEnum.BLACK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.BLACK,
      iconColor: ColorsEnum.BLACK,
      iconSize: XS_SMALLER_ICON_SIZE,
    },
    quaternary: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(1),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.PRIMARY,
      textColor: ColorsEnum.PRIMARY,
      backgroundColor: ColorsEnum.TRANSPARENT,
      iconSize: XXS_SMALLER_ICON_SIZE,
    },
    quaternaryBlack: {
      marginLeft: 0,
      marginLeftIcon: getSpacing(1),
      loadingIconColor: ColorsEnum.PRIMARY_DARK,
      iconColor: ColorsEnum.BLACK,
      textColor: ColorsEnum.BLACK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      iconSize: XXS_SMALLER_ICON_SIZE,
    },
    linearGradient: {
      iconSize: getSpacing(5),
      iconColor: ColorsEnum.WHITE,
    },
  },
}
