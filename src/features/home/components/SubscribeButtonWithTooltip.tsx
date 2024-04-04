import React from 'react'
import styled from 'styled-components/native'

import { SubscribeButton } from 'features/home/components/SubscribeButton'
import { Tooltip } from 'ui/components/Tooltip'
import { getSpacing } from 'ui/theme'

const WIDGET_HEIGHT = getSpacing(10 + 1 + 4) // roundedButton + padding + caption
const TOOLTIP_WIDTH = getSpacing(65)

export const SubscribeButtonWithTooltip = (props: { active: boolean; onPress: () => void }) => {
  return (
    <React.Fragment>
      <SubscribeButton {...props} />
      <StyledTooltip
        label="Suis ce thème pour recevoir de l’actualité sur ce sujet&nbsp;!"
        pointerDirection="bottom"
        isVisible={!props.active}
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
