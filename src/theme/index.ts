import {
  theme as idCheckTheme,
  ThemeType as IdCheckThemeType,
} from '@pass-culture/id-check/src/theme'
import deepmerge from 'deepmerge'
import {
  isMobile as isMobileDeviceDetect,
  isTablet as isTabletDeviceDetect,
} from 'react-device-detect'
import { Platform } from 'react-native'

import { getSpacing, TAB_BAR_COMP_HEIGHT } from 'ui/theme'
import { ACTIVE_OPACITY, ColorsEnum, UniqueColors } from 'ui/theme/colors'
import { BorderRadiusEnum, Breakpoints } from 'ui/theme/grid'
import { ZIndex } from 'ui/theme/layers'

const isNative = Platform.OS === 'ios' || Platform.OS === 'android'
const isTouchWeb = Platform.OS === 'web' && (isMobileDeviceDetect || isTabletDeviceDetect)
const isTouch = isNative || isTouchWeb

export interface AppThemeType extends Omit<IdCheckThemeType, 'colors'> {
  appContentWidth: number
  appBarHeight: number
  navTopHeight: number
  tabBarHeight: number
  isMobile?: boolean
  isTablet?: boolean
  isDesktop?: boolean
  isTouch: boolean
  activeOpacity: number
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
  zIndexTabBar: number
  zIndexHeaderNav: number
}

export const theme: AppThemeType = deepmerge(idCheckTheme, {
  appContentWidth: getSpacing(100),
  appBarHeight: getSpacing(16),
  navTopHeight: getSpacing(20),
  tabBarHeight: TAB_BAR_COMP_HEIGHT,
  isTouch,
  activeOpacity: ACTIVE_OPACITY,
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
  zIndexTabBar: ZIndex.TABBAR,
  zIndexHeaderNav: ZIndex.HEADER_NAV,
})
