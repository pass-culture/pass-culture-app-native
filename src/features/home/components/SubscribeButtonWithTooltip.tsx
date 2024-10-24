import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { SubscribeButton } from 'features/subscription/components/buttons/SubscribeButton'
import { storage } from 'libs/storage'
import { Tooltip } from 'ui/components/Tooltip'
import { getSpacing } from 'ui/theme'

const WIDGET_HEIGHT = getSpacing(10 + 1 + 4) // roundedButton + padding + caption
const TOOLTIP_WIDTH = getSpacing(65)
const DISPLAY_START_OFFSET_IN_MS = 1000
const DISPLAY_DURATION_IN_MS = 8000
const MAX_TOOLTIP_DISPLAYS = 3

export const SubscribeButtonWithTooltip = (props: { active: boolean; onPress: () => void }) => {
  const [isTooltipVisible, setIsTooltipVisible] = React.useState(false)

  const displayTooltipIfNeeded = useCallback(async () => {
    const timesTooltipHasBeenDisplayed = Number(
      await storage.readString('times_subscription_tooltip_has_been_displayed')
    )

    setIsTooltipVisible(timesTooltipHasBeenDisplayed < MAX_TOOLTIP_DISPLAYS)

    await storage.saveString(
      'times_subscription_tooltip_has_been_displayed',
      String(timesTooltipHasBeenDisplayed + 1)
    )
  }, [setIsTooltipVisible])

  const hideTooltip = useCallback(() => setIsTooltipVisible(false), [setIsTooltipVisible])
  const onCloseIconPress = useCallback(async () => {
    setIsTooltipVisible(false)
    await storage.saveString(
      'times_subscription_tooltip_has_been_displayed',
      String(MAX_TOOLTIP_DISPLAYS)
    )
  }, [setIsTooltipVisible])

  useEffect(() => {
    if (props.active) return

    const timeoutOn = setTimeout(displayTooltipIfNeeded, DISPLAY_START_OFFSET_IN_MS)
    const timeoutOff = setTimeout(hideTooltip, DISPLAY_START_OFFSET_IN_MS + DISPLAY_DURATION_IN_MS)

    return () => {
      clearTimeout(timeoutOn)
      clearTimeout(timeoutOff)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayTooltipIfNeeded, hideTooltip])

  return (
    <React.Fragment>
      <SubscribeButton label={{ active: 'Déjà suivi', inactive: 'Suivre' }} {...props} />
      <StyledTooltip
        label="Suis ce thème pour recevoir de l’actualité sur ce sujet&nbsp;!"
        pointerDirection="top"
        isVisible={isTooltipVisible}
        onHide={hideTooltip}
        onCloseIconPress={onCloseIconPress}
      />
    </React.Fragment>
  )
}

const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  position: 'absolute',
  bottom: -WIDGET_HEIGHT,
  right: 0,
  zIndex: theme.zIndex.header,
  width: TOOLTIP_WIDTH,
}))
