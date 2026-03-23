import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { useIconWiggle } from 'features/subscription/helpers/useIconWiggle'
import { storage } from 'libs/storage'
import { Tooltip } from 'ui/components/Tooltip'
import { Button } from 'ui/designSystem/Button/Button'
import type { ButtonNativeProps, ButtonSize } from 'ui/designSystem/Button/types'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { getSpacing } from 'ui/theme'

const WIDGET_HEIGHT = getSpacing(6) // fallback offset before layout measurement
const TOOLTIP_WIDTH = getSpacing(65)
const DISPLAY_START_OFFSET_IN_MS = 1000
const DISPLAY_DURATION_IN_MS = 8000
const MAX_TOOLTIP_DISPLAYS = 3

export const SubscribeButtonWithTooltip = (props: {
  active: boolean
  onPress: () => void
  size?: ButtonSize
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [buttonHeight, setButtonHeight] = useState<number | null>(null)
  const { iconAnimatedStyle, trigger } = useIconWiggle()

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

  const isSmall = props.size === 'small'
  const wording = props.active ? 'Déjà suivi' : 'Suivre'
  const a11yLabel = props.active ? 'Thème déjà suivi' : 'Suivre le thème'
  const icon = props.active ? ActiveBellIcon : Bell

  const onPressWithAnimation = () => {
    if (!props.active) trigger()
    props.onPress()
  }

  const buttonCommonProps = {
    icon,
    variant: 'secondary',
    color: 'neutral',
    size: 'small',
    onPress: onPressWithAnimation,
    accessibilityLabel: a11yLabel,
    iconAnimatedStyle,
  } as const

  const buttonProps: ButtonNativeProps = {
    ...buttonCommonProps,
    ...(isSmall ? { iconButton: true } : { wording }),
  }

  const tooltipOffset = buttonHeight ?? WIDGET_HEIGHT

  return (
    <TooltipAnchor onLayout={(event) => setButtonHeight(event.nativeEvent.layout.height)}>
      <Button {...buttonProps} />
      <StyledTooltip
        label="Suis ce thème pour recevoir de l’actualité sur ce sujet&nbsp;!"
        pointerDirection="top"
        isVisible={isTooltipVisible}
        onHide={hideTooltip}
        onCloseIconPress={onCloseIconPress}
        offset={tooltipOffset}
      />
    </TooltipAnchor>
  )
}

const TooltipAnchor = styled.View({ alignSelf: 'flex-start', position: 'relative' })

const StyledTooltip = styled(Tooltip)<{ offset: number }>(({ theme, offset }) => ({
  position: 'absolute',
  top: offset,
  right: 0,
  zIndex: theme.zIndex.header,
  width: TOOLTIP_WIDTH,
}))

const ActiveBellIcon = styled(BellFilled).attrs(({ theme }) => ({
  color: theme.designSystem.color.background.brandPrimary,
}))``
