import { Platform } from 'react-native'

// eslint-disable-next-line no-restricted-imports
import { isMobileDeviceDetectOnWeb, isTabletDeviceDetectOnWeb } from 'libs/react-device-detect'
import { ColorSchemeType } from 'libs/styled/useColorScheme'
// eslint-disable-next-line no-restricted-imports
import { ModalSpacing } from 'ui/components/modals/enum'
import { getSpacing } from 'ui/theme'
import { buttonHeights } from 'ui/theme/buttonHeights'
// eslint-disable-next-line no-restricted-imports
import { ACTIVE_OPACITY, ColorsEnum } from 'ui/theme/colors'
import {
  BOTTOM_CONTENT_PAGE_OFFSET_TOP_HEIGHT_DESKTOP_TABLET,
  DESKTOP_CONTENT_MAX_WIDTH,
  DESKTOP_CONTENT_MEDIUM_WIDTH,
  MARGIN_HORIZONTAL,
  MARGIN_VERTICAL,
  TAB_BAR_COMP_HEIGHT,
  TAB_BAR_COMP_HEIGHT_V2,
} from 'ui/theme/constants'
import { BorderRadiusEnum, Breakpoints } from 'ui/theme/grid'
import { iconSizes } from 'ui/theme/iconSizes'
import { illustrationSizes } from 'ui/theme/illustrationSizes'
// eslint-disable-next-line no-restricted-imports
import { zIndex } from 'ui/theme/layers'

import { designTokensLight } from './designTokens'

const isNative = Platform.OS === 'ios' || Platform.OS === 'android'
const isTouchWeb = Platform.OS === 'web' && (isMobileDeviceDetectOnWeb || isTabletDeviceDetectOnWeb)
const isTouch = isNative || isTouchWeb

export const theme = {
  appContentWidth: getSpacing(100),
  minScreenHeight: getSpacing(142),
  appBarHeight: getSpacing(16),
  navTopHeight: getSpacing(20),
  image: {
    square: {
      sizes: {
        small: {
          width: getSpacing(10),
          height: getSpacing(10),
          borderRadius: getSpacing(1),
        },
        medium: {
          width: getSpacing(20),
          height: getSpacing(20),
          borderRadius: getSpacing(1),
        },
        large: {
          width: getSpacing(30),
          height: getSpacing(30),
          borderRadius: getSpacing(2),
        },
      },
    },
  },
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
    style: 'solid',
    offSet: getSpacing(0.5),
  },
  tabBar: {
    height: TAB_BAR_COMP_HEIGHT,
    heightV2: TAB_BAR_COMP_HEIGHT_V2,
    iconSize: getSpacing(7),
    fontSize: getSpacing(2.5),
    labelMinScreenWidth: 375,
    showLabels: true as boolean | undefined, // default value, the actual value is computed dynamically in ThemeProvider.tsx
  },
  ticket: {
    maxWidth: 300,
    minHeight: 192,
    qrCodeSize: 170,
    sizeRatio: 0.755, // 0.05 is a hack to fit header and footer ThreeShapesTicket shadow
  },
  tiles: {
    borderRadius: getSpacing(1),
    maxCaptionHeight: {
      venue: getSpacing(18),
      offerTile: getSpacing(32),
      offer: getSpacing(18),
      videoModuleOffer: getSpacing(14),
    },
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
      xLarge: {
        width: getSpacing(36.5),
        height: getSpacing(55),
      },
    },
  },
  designSystem: designTokensLight,
  colors: {
    aquamarineLight: ColorsEnum.AQUAMARINE_LIGHT,
    black: ColorsEnum.BLACK,
    coral: ColorsEnum.CORAL,
    coralLight: ColorsEnum.CORAL_LIGHT,
    deepPinkLight: ColorsEnum.DEEP_PINK_LIGHT,
    goldLight100: ColorsEnum.GOLD_LIGHT_100,
    greyDark: ColorsEnum.GREY_DARK,
    greyMedium: ColorsEnum.GREY_MEDIUM,
    lilacLight: ColorsEnum.LILAC_LIGHT,
    primary: ColorsEnum.PRIMARY,
    primaryDark: ColorsEnum.PRIMARY_DARK,
    secondaryDark: ColorsEnum.SECONDARY_DARK,
    skyBlue: ColorsEnum.SKY_BLUE,
    skyBlueLight: ColorsEnum.SKY_BLUE_LIGHT,
    white: ColorsEnum.WHITE,
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
    tile: BorderRadiusEnum.TILE,
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
    bottomSheet: zIndex.bottomSheet,
  },
  contentPage: {
    marginHorizontal: MARGIN_HORIZONTAL,
    marginVertical: MARGIN_VERTICAL,
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
    primary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.small,
    },
    primaryWhite: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.small,
    },
    primaryBlack: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.small,
    },
    secondary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.small,
      borderWidth: getSpacing(0.5),
    },
    secondaryWhite: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.small,
      borderWidth: getSpacing(0.5),
    },
    secondaryBlack: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.smaller,
      borderWidth: getSpacing(0.5),
    },
    tertiary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.smaller,
    },
    tertiaryBlack: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.smaller,
    },
    tertiaryWhite: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.smaller,
    },
    tertiaryNeutralInfo: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.smaller,
    },
    tertiarySecondary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(2),
      iconSize: iconSizes.smaller,
    },
    quaternaryPrimary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      iconSize: iconSizes.extraSmall,
    },
    quaternaryBlack: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      iconSize: iconSizes.extraSmall,
    },
    quaternaryGrey: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      iconSize: iconSizes.extraSmall,
    },
    quaternarySecondary: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      iconSize: iconSizes.extraSmall,
    },
    quaternaryNeutralInfo: {
      marginLeft: 0,
      marginLeftWithIcon: getSpacing(1),
      iconSize: iconSizes.extraSmall,
    },
    linearGradient: {
      iconSize: iconSizes.small,
    },
    scrollButton: {
      size: getSpacing(10),
      borderWidth: getSpacing(0.25),
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
  checkbox: {
    size: getSpacing(5),
    border: {
      size: 2,
    },
  },
} as const

export type BaseAppThemeType = typeof theme
export type AppThemeType = BaseAppThemeType & {
  colorScheme?: ColorSchemeType
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
