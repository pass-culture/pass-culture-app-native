import React, { FunctionComponent } from 'react'
import { useTheme } from 'styled-components'

import { VideoCarouselModuleDesktop } from 'features/home/components/modules/video/VideoCarouselModuleDesktop'
import { VideoCarouselModuleBaseProps } from 'features/home/types'

export const VideoCarouselModule: FunctionComponent<VideoCarouselModuleBaseProps> = (props) => {
  const { isDesktopViewport } = useTheme()
  return isDesktopViewport ? <VideoCarouselModuleDesktop {...props} /> : null
}
