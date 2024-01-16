import { useTheme } from 'styled-components'

export function useGetFullscreenModalSliderLength(hasFormWidthLimit = true) {
  const { isDesktopViewport, forms, slider, modal } = useTheme()
  const baseSliderContainerWidth = hasFormWidthLimit ? forms.maxWidth : modal.desktopMaxWidth

  return {
    sliderLength: isDesktopViewport ? baseSliderContainerWidth - slider.markerSize : undefined,
  }
}
