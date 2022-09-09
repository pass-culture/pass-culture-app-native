import { CSSObject } from 'styled-components'
import { DefaultTheme } from 'styled-components/native'

import { ModalSpacing } from 'ui/components/modals/enum'
import { getSpacing } from 'ui/theme'

const BORDER_HORIZTONAL_RADIUS = getSpacing(5)
const BORDER_VERTICAL_RADIUS = getSpacing(4)

type Props = {
  theme: DefaultTheme
  desktopMaxHeight?: number
  height?: number
  maxHeight: number
  noPadding?: boolean
}

export const appModalContainerStyle = ({
  theme,
  height,
  desktopMaxHeight,
  maxHeight,
  noPadding,
}: Props): CSSObject => ({
  alignItems: 'center',
  backgroundColor: theme.colors.white,
  borderTopStartRadius: BORDER_VERTICAL_RADIUS,
  borderTopEndRadius: BORDER_VERTICAL_RADIUS,
  borderTopRightRadius: BORDER_HORIZTONAL_RADIUS,
  borderTopLeftRadius: BORDER_HORIZTONAL_RADIUS,
  flexDirection: 'column',
  justifyContent: 'center',
  ...(noPadding ? {} : { padding: ModalSpacing.MD }),
  paddingBottom: ModalSpacing.LG,
  width: '100%',
  height,
  ...(theme.isDesktopViewport
    ? {
        borderBottomStartRadius: BORDER_VERTICAL_RADIUS,
        borderBottomEndRadius: BORDER_VERTICAL_RADIUS,
        borderBottomRightRadius: BORDER_HORIZTONAL_RADIUS,
        borderBottomLeftRadius: BORDER_HORIZTONAL_RADIUS,
        maxHeight: desktopMaxHeight,
        maxWidth: getSpacing(130),
      }
    : {
        borderBottomStartRadius: 0,
        borderBottomEndRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        maxHeight,
        maxWidth: theme.appContentWidth,
      }),
})
