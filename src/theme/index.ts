import { Platform } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb, isTabletDeviceDetectOnWeb } from 'libs/react-device-detect'
// eslint-disable-next-line no-restricted-imports
import { ModalSpacing } from 'ui/components/modals/enum'
import { getSpacing, getSpacingString } from 'ui/theme'
import { buttonHeights } from 'ui/theme/buttonHeights'
// eslint-disable-next-line no-restricted-imports
import { ACTIVE_OPACITY, ColorsEnum, UniqueColors } from 'ui/theme/colors'
import {
  BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET,
  DESKTOP_CONTENT_MAX_WIDTH,
  DESKTOP_CONTENT_MEDIUM_WIDTH,
  MARGIN_HORIZONTAL,
  TAB_BAR_COMP_HEIGHT,
} from 'ui/theme/constants'
import { BorderRadiusEnum, Breakpoints } from 'ui/theme/grid'
import { iconSizes } from 'ui/theme/iconSizes'
import { illustrationSizes } from 'ui/theme/illustrationSizes'
// eslint-disable-next-line no-restricted-imports
import { zIndex } from 'ui/theme/layers'

const isNative = Platform.OS === 'ios' || Platform.OS === 'android'
const isTouchWeb = Platform.OS === 'web' && (isMobileDeviceDetectOnWeb || isTabletDeviceDetectOnWeb)
const isTouch = isNative || isTouchWeb

export const theme = {
  appContentWidth: getSpacing(100),
  minScreenHeight: getSpacing(142),
  appBarHeight: getSpacing(16),
  navTopHeight: getSpacing(20),
  inputs: {
    height: {
      small: getSpacing(10),
      regular: getSpacing(12),
      tall: getSpacing(23.5),
    },
  },
  isTouch,
  isNative,
  isSmallScreen: false as boolean | undefined, // default value, the actual value is computed dynamically in ThemeProvider.tsx
  showTabBar: true as boolean | undefined, // default value, the actual value is computed dynamically in ThemeProvider.tsx
  activeOpacity: ACTIVE_OPACITY,
  fontFamily: {
    regular: 'Montserrat-Regular',
    italic: 'Montserrat-Italic',
    medium: 'Montserrat-Medium',
    semiBold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
    black: 'Montserrat-Black',
    boldItalic: 'Montserrat-BoldItalic',
  },
  forms: { maxWidth: DESKTOP_CONTENT_MAX_WIDTH },
  controlComponent: {
    size: iconSizes.small,
  },
  outline: {
    width: getSpacing(0.5),
    color: ColorsEnum.PRIMARY,
    style: 'solid',
    offSet: getSpacing(0.5),
  },
  tabBar: {
    height: TAB_BAR_COMP_HEIGHT,
    iconSize: getSpacing(7),
    fontSize: getSpacing(2.5),
    labelMinScreenWidth: 375,
    showLabels: true as boolean | undefined, // default value, the actual value is computed dynamically in ThemeProvider.tsx
  },
  ticket: {
    maxWidth: 300,
    minHeight: 192,
    qrCodeSize: 170,
    backgroundColor: ColorsEnum.WHITE,
    borderColor: ColorsEnum.GREY_LIGHT,
    sizeRatio: 0.755, // 0.05 is a hack to fit header and footer ThreeShapesTicket shadow
  },
  tiles: {
    borderRadius: getSpacing(1),
    sizes: {
      small: {
        width: getSpacing(16),
        height: getSpacing(24),
      },
      medium: {
        width: getSpacing(20),
        height: getSpacing(28),
      },
      tall: {
        width: getSpacing(20),
        height: getSpacing(30),
      },
      large: {
        width: getSpacing(24),
        height: getSpacing(36),
      },
    },
  },
  typography: {
    hero: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getSpacing(9.5),
      lineHeight: getSpacingString(12),
      color: ColorsEnum.BLACK,
    },
    title1: {
      fontFamily: 'Montserrat-Black',
      fontSize: getSpacing(6.5),
      lineHeight: getSpacingString(8.5),
      color: ColorsEnum.BLACK,
    },
    title2: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getSpacing(5.5),
      lineHeight: getSpacingString(6.5),
      color: ColorsEnum.BLACK,
    },
    title3: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getSpacing(5),
      lineHeight: getSpacingString(6),
      color: ColorsEnum.BLACK,
    },
    title4: {
      fontFamily: 'Montserrat-Medium',
      fontSize: getSpacing(4.5),
      lineHeight: getSpacingString(5.5),
      color: ColorsEnum.BLACK,
    },
    buttonText: {
      fontFamily: 'Montserrat-Bold',
      fontSize: getSpacing(3.75),
      lineHeight: getSpacingString(5),
      color: ColorsEnum.BLACK,
    },
    body: {
      fontFamily: 'Montserrat-Regular',
      fontSize: getSpacing(3.75),
      lineHeight: getSpacingString(5),
      color: ColorsEnum.BLACK,
    },
    caption: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: getSpacing(3),
      lineHeight: getSpacingString(4),
      color: ColorsEnum.BLACK,
    },
    hint: {
      fontFamily: 'Montserrat-SemiBold',
      fontSize: getSpacing(2.5),
      lineHeight: getSpacingString(3),
      color: ColorsEnum.BLACK,
    },
    placeholder: {
      fontFamily: 'Montserrat-Italic',
      fontSize: getSpacing(3.75),
      lineHeight: getSpacingString(5),
      color: ColorsEnum.GREY_DARK,
    },
    bodyBoldItalic: {
      fontFamily: 'Montserrat-BoldItalic',
      fontSize: getSpacing(3.75),
      lineHeight: getSpacingString(5),
      color: ColorsEnum.BLACK,
    },
  },
  colors: {
    accent: ColorsEnum.ACCENT,
    attention: ColorsEnum.ATTENTION,
    attentionLight: ColorsEnum.ATTENTION_LIGHT,
    black: ColorsEnum.BLACK,
    error: ColorsEnum.ERROR,
    errorLight: ColorsEnum.ERROR_LIGHT,
    greenValid: ColorsEnum.GREEN_VALID,
    greenLight: ColorsEnum.GREEN_LIGHT,
    greyDark: ColorsEnum.GREY_DARK,
    greySemiDark: ColorsEnum.GREY_SEMI_DARK,
    greyMedium: ColorsEnum.GREY_MEDIUM,
    greyLight: ColorsEnum.GREY_LIGHT,
    primary: ColorsEnum.PRIMARY,
    primaryDisabled: ColorsEnum.PRIMARY_DISABLED,
    primaryDark: ColorsEnum.PRIMARY_DARK,
    secondary: ColorsEnum.SECONDARY,
    secondaryLight: ColorsEnum.SECONDARY_LIGHT,
    tertiary: ColorsEnum.TERTIARY,
    transparent: ColorsEnum.TRANSPARENT,
    white: ColorsEnum.WHITE,
    gold: ColorsEnum.GOLD,
    goldLight: ColorsEnum.GOLD_LIGHT,
    aquamarine: ColorsEnum.AQUAMARINE,
    aquamarineLight: ColorsEnum.AQUAMARINE_LIGHT,
    skyBlue: ColorsEnum.SKY_BLUE,
    skyBlueLight: ColorsEnum.SKY_BLUE_LIGHT,
    deepPink: ColorsEnum.DEEP_PINK,
    deepPinkLight: ColorsEnum.DEEP_PINK_LIGHT,
    coral: ColorsEnum.CORAL,
    coralLight: ColorsEnum.CORAL_LIGHT,
    lilac: ColorsEnum.LILAC,
    lilacLight: ColorsEnum.LILAC_LIGHT,
  },
  uniqueColors: {
    tabBar: UniqueColors.TAB_BAR,
    greyOverlay: UniqueColors.GREY_OVERLAY,
    backgroundColor: UniqueColors.BACKGROUND_COLOR,
    backgroundSurface: UniqueColors.BACKGROUND_SURFACE,
    foregroundColor: UniqueColors.FOREGROUND_COLOR,
    brand: UniqueColors.BRAND,
    brandDark: UniqueColors.BRAND_DARK,
    greenDisabled: UniqueColors.GREEN_DISABLED,
  },
  breakpoints: {
    xxs: Breakpoints.XXS,
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
    background: zIndex.background,
    cheatCodeButton: zIndex.cheatCodeButton,
    favoritePastilleContent: zIndex.favoritePastilleContent,
    floatingButton: zIndex.floatingButton,
    homeOfferCoverIcons: zIndex.homeOfferCoverIcons,
    header: zIndex.header,
    locationWidget: zIndex.locationWidget,
    modalHeader: zIndex.modalHeader,
    progressbar: zIndex.progressbar,
    playlistsButton: zIndex.playlistButton,
    progressbarIcon: zIndex.progressbarIcon,
    tabBar: zIndex.tabBar,
    headerNav: zIndex.headerNav,
    snackbar: zIndex.snackbar,
  },
  offlineMode: {
    banner: {
      backgroundColor: ColorsEnum.BLACK,
      textColor: ColorsEnum.WHITE,
    },
  },
  contentPage: {
    marginHorizontal: MARGIN_HORIZONTAL,
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
      extraSmall: buttonHeights.extraSmall,
    },
    outlineColor: ColorsEnum.ACCENT,
    loading: {
      primary: {
        backgroundColor: ColorsEnum.PRIMARY_DARK,
      },
      secondary: {
        borderColor: ColorsEnum.PRIMARY_DARK,
      },
      secondaryWhite: {
        borderColor: ColorsEnum.GREY_LIGHT,
      },
      secondaryBlack: {
        borderColor: ColorsEnum.GREY_DARK,
      },
    },
    disabled: {
      primary: {
        backgroundColor: ColorsEnum.GREY_LIGHT,
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_DARK,
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
        backgroundColor: ColorsEnum.GREY_LIGHT,
        borderColor: ColorsEnum.GREY_LIGHT,
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_MEDIUM,
      },
      secondaryBlack: {
        backgroundColor: ColorsEnum.GREY_DARK,
        borderColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.BLACK,
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
      tertiaryNeutralInfo: {
        textColor: ColorsEnum.GREY_MEDIUM,
        iconColor: ColorsEnum.GREY_MEDIUM,
      },
      tertiarySecondary: {
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_DARK,
      },
      quaternaryPrimary: {
        iconColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.GREY_DARK,
      },
      quaternaryBlack: {
        iconColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.GREY_DARK,
      },
      quaternarySecondary: {
        iconColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.GREY_DARK,
      },
      quaternaryNeutralInfo: {
        iconColor: ColorsEnum.GREY_DARK,
        textColor: ColorsEnum.GREY_DARK,
      },
      linearGradient: {
        backgroundColor: ColorsEnum.GREY_LIGHT,
        textColor: ColorsEnum.GREY_DARK,
        iconColor: ColorsEnum.GREY_DARK,
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
      outlineColor: ColorsEnum.WHITE,
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
      loadingIconColor: ColorsEnum.GREY_LIGHT,
      iconColor: ColorsEnum.WHITE,
      iconSize: iconSizes.small,
      textColor: ColorsEnum.WHITE,
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderColor: ColorsEnum.WHITE,
      borderWidth: getSpacing(0.5),
      outlineColor: ColorsEnum.WHITE,
    },
    secondaryBlack: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      loadingIconColor: ColorsEnum.GREY_LIGHT,
      iconColor: ColorsEnum.BLACK,
      iconSize: iconSizes.small,
      textColor: ColorsEnum.BLACK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      borderColor: ColorsEnum.BLACK,
      borderWidth: getSpacing(0.5),
      outlineColor: ColorsEnum.BLACK,
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
      outlineColor: ColorsEnum.WHITE,
    },
    tertiaryNeutralInfo: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      textColor: ColorsEnum.GREY_DARK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.GREY_DARK,
      iconColor: ColorsEnum.GREY_DARK,
      iconSize: iconSizes.smaller,
    },
    tertiarySecondary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      textColor: ColorsEnum.SECONDARY,
      backgroundColor: ColorsEnum.TRANSPARENT,
      loadingIconColor: ColorsEnum.SECONDARY,
      iconColor: ColorsEnum.SECONDARY,
      iconSize: iconSizes.smaller,
    },
    quaternaryPrimary: {
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
    quaternarySecondary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      loadingIconColor: ColorsEnum.SECONDARY,
      iconColor: ColorsEnum.SECONDARY,
      textColor: ColorsEnum.SECONDARY,
      backgroundColor: ColorsEnum.TRANSPARENT,
      iconSize: iconSizes.extraSmall,
    },
    quaternaryNeutralInfo: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      loadingIconColor: ColorsEnum.GREY_DARK,
      iconColor: ColorsEnum.GREY_DARK,
      textColor: ColorsEnum.GREY_DARK,
      backgroundColor: ColorsEnum.TRANSPARENT,
      iconSize: iconSizes.extraSmall,
    },
    linearGradient: {
      iconSize: iconSizes.small,
      iconColor: ColorsEnum.WHITE,
      textColor: ColorsEnum.WHITE,
    },
    scrollButton: {
      size: getSpacing(10),
      borderWidth: getSpacing(0.25),
      borderColor: ColorsEnum.GREY_MEDIUM,
      backgroundColor: ColorsEnum.WHITE,
    },
    roundedButton: {
      size: getSpacing(10),
    },
  },
  slider: {
    markerSize: getSpacing(9),
    trackHeight: getSpacing(4),
  },
  modal: {
    spacing: ModalSpacing,
    desktopMaxWidth: getSpacing(130),
  },
  home: {
    spaceBetweenModules: getSpacing(6),
  },
} as const

export type BaseAppThemeType = typeof theme
export type AppThemeType = BaseAppThemeType & {
  isMobileViewport?: boolean
  isTabletViewport?: boolean
  isDesktopViewport?: boolean
  isSmallScreen?: boolean
  showTabBar: boolean
  appContentWidth: number
  tabBar: BaseAppThemeType['tabBar'] & {
    showLabels?: boolean
  }
}
