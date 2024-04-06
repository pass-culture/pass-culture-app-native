import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { SubscribeButton } from 'features/home/components/SubscribeButton'
import { Tooltip } from 'ui/components/Tooltip'
import { getSpacing } from 'ui/theme'

const WIDGET_HEIGHT = getSpacing(10 + 1 + 4) // roundedButton + padding + caption
const TOOLTIP_WIDTH = getSpacing(65)
const DISPLAY_START_OFFSET_IN_MS = 1000
const DISPLAY_DURATION_IN_MS = 8000

export const SubscribeButtonWithTooltip = (props: { active: boolean; onPress: () => void }) => {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)

  const displayTooltip = useCallback(() => setIsTooltipVisible(true), [setIsTooltipVisible])
  const hideTooltip = useCallback(() => setIsTooltipVisible(false), [setIsTooltipVisible])

  useEffect(() => {
    if (props.active) return

    const timeoutOn = setTimeout(displayTooltip, DISPLAY_START_OFFSET_IN_MS)
    const timeoutOff = setTimeout(hideTooltip, DISPLAY_START_OFFSET_IN_MS + DISPLAY_DURATION_IN_MS)

    return () => {
      clearTimeout(timeoutOn)
      clearTimeout(timeoutOff)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayTooltip, hideTooltip])

  return (
    <React.Fragment>
      <SubscribeButton {...props} />
      <StyledTooltip
        label="Suis ce thème pour recevoir de l’actualité sur ce sujet&nbsp;!"
        pointerDirection="bottom"
        isVisible={isTooltipVisible}
      />
    </React.Fragment>
  )
}

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  position: 'absolute',
  top: -WIDGET_HEIGHT - getSpacing(0.5),
  right: -getSpacing(1),
  zIndex: theme.zIndex.header,
  width: TOOLTIP_WIDTH,
}))
