import { useTheme } from 'styled-components'

export function useGetFullscreenModalSliderLength(hasFormWidthLimit = true) {
  const { isDesktopViewport, forms, modal, appContentWidth } = useTheme()
  const deviceMaxWidth = isDesktopViewport ? modal.desktopMaxWidth : appContentWidth
  const whiteAroundScreenWidth = modal.spacing.MD * 2
  return {
    sliderLength: (hasFormWidthLimit ? forms.maxWidth : deviceMaxWidth) - whiteAroundScreenWidth,
  }
}
