import { CSSObject } from 'styled-components'

import { ModalContainerProps } from 'ui/components/modals/AppModal'

export const appModalContainerStyle = ({
  theme,
  height,
  maxHeight,
  noPadding,
  noPaddingBottom,
  desktopConstraints,
  isLandscape,
  rightNootch,
  leftNootch,
}: ModalContainerProps): CSSObject => {
  return {
    alignItems: 'center',
    backgroundColor: theme.designSystem.color.background.default,
    borderTopRightRadius: theme.designSystem.size.borderRadius.l,
    borderTopLeftRadius: theme.designSystem.size.borderRadius.l,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height,
    ...(noPadding
      ? {
          paddingRight: isLandscape ? rightNootch : 0,
          paddingLeft: isLandscape ? leftNootch : 0,
        }
      : {
          padding: theme.modal.spacing.MD,
        }),
    ...(noPaddingBottom ? {} : { paddingBottom: theme.modal.spacing.LG }),
    ...(theme.isDesktopViewport
      ? {
          borderBottomRightRadius: theme.designSystem.size.borderRadius.l,
          borderBottomLeftRadius: theme.designSystem.size.borderRadius.l,
          maxHeight: desktopConstraints?.maxHeight,
          maxWidth: desktopConstraints?.maxWidth,
        }
      : {
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          maxHeight,
          maxWidth: theme.appContentWidth,
        }),
  }
}
