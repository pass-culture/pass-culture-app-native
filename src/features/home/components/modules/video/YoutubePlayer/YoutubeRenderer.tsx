import React, { MutableRefObject, forwardRef } from 'react'
import RNYoutubeIframe, { YoutubeIframeRef } from 'react-native-youtube-iframe'
import { useTheme } from 'styled-components'

import { YoutubeRendererProps, YoutubeRendererRef } from './types'

export const YoutubeRenderer = forwardRef<YoutubeRendererRef, YoutubeRendererProps>(
  function YoutubeRenderer(playerProps, ref) {
    const { designSystem } = useTheme()
    const _ref = ref as MutableRefObject<YoutubeIframeRef | null> // Cast ref to the correct type

    return (
      <RNYoutubeIframe
        {...playerProps}
        ref={_ref}
        webViewProps={{
          overScrollMode: 'never',
          bounces: false,
          scrollEnabled: false,
          injectedJavaScript: `
            document.querySelector("body").style.backgroundColor="${designSystem.color.background.lockedInverted}";
            var element = document.getElementsByClassName("container")[0];
            element.style.position = "unset";
            true;
          `,
        }}
      />
    )
  }
)
