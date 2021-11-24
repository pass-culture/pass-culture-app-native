import {
  theme as idCheckTheme,
  ThemeType as IdCheckThemeType,
} from '@pass-culture/id-check/src/theme'
import deepmerge from 'deepmerge'
import { Platform } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb, isTabletDeviceDetectOnWeb } from 'libs/react-device-detect'
import {
  BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET,
  getSpacing,
  getSpacingString,
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

export interface AppThemeType extends Omit<IdCheckThemeType, 'colors' | 'typography'> {
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
    extraBoldItalic: string
    mediumItalic: string
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
    greenDisabled: ColorsEnum
    greenLight: ColorsEnum
    greyDark: ColorsEnum
    greyMedium: ColorsEnum
    greyDisabled: ColorsEnum
    greyLight: ColorsEnum
    primary: ColorsEnum
    primaryDisabled: ColorsEnum
    primaryDark: ColorsEnum
    secondary: ColorsEnum
    tertiary: ColorsEnum
    transparent: ColorsEnum
    white: ColorsEnum
    brand: ColorsEnum
    brandDark: ColorsEnum
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
}

export const theme: AppThemeType = deepmerge(idCheckTheme, {
  appContentWidth: getSpacing(100),
  appBarHeight: getSpacing(16),
  navTopHeight: getSpacing(20),
  tabBarHeight: TAB_BAR_COMP_HEIGHT,
  isTouch,
  showTabBar: true, // default value, the actual value is computed dynamically in ThemeProvider.tsx
  activeOpacity: ACTIVE_OPACITY,
  fontFamily: {
    medium: 'Montserrat-Medium',
    extraBoldItalic: 'Montserrat-ExtraBoldItalic',
    mediumItalic: 'Montserrat-MediumItalic',
    bold: 'Montserrat-Bold',
    regular: 'Montserrat-Regular',
    semiBold: 'Montserrat-SemiBold',
  },
  typography: {
    hero: {
      fontFamily: 'Montserrat-ExtraBoldItalic',
      fontSize: getSpacing(7),
      lineHeight: getSpacingString(8.5),
      fontWeight: 800,
    },
    title1: {
      fontFamily: 'Montserrat-ExtraBoldItalic',
      fontSize: getSpacing(6),
      lineHeight: getSpacingString(8.5),
      fontWeight: 800,
    },
    title2: {
      fontFamily: 'Montserrat-MediumItalic',
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
    ...idCheckTheme.colors,
    accent: ColorsEnum.ACCENT,
    attention: ColorsEnum.ATTENTION,
    black: ColorsEnum.BLACK,
    error: ColorsEnum.ERROR,
    greenValid: ColorsEnum.GREEN_VALID,
    greenDisabled: ColorsEnum.GREEN_DISABLED,
    greenLight: ColorsEnum.GREEN_LIGHT,
    greyDark: ColorsEnum.GREY_DARK,
    greyMedium: ColorsEnum.GREY_MEDIUM,
    greyDisabled: ColorsEnum.GREY_DISABLED,
    greyLight: ColorsEnum.GREY_LIGHT,
    primary: ColorsEnum.PRIMARY,
    primaryDisabled: ColorsEnum.PRIMARY_DISABLED,
    primaryDark: ColorsEnum.PRIMARY_DARK,
    secondary: ColorsEnum.SECONDARY,
    tertiary: ColorsEnum.TERTIARY,
    transparent: ColorsEnum.TRANSPARENT,
    white: ColorsEnum.WHITE,
    brand: ColorsEnum.BRAND,
    brandDark: ColorsEnum.BRAND_DARK,
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
})
