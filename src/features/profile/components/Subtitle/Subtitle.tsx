import React from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { Typo } from 'ui/theme'

type Props = {
  startSubtitle?: string
  boldEndSubtitle?: string
}

export const Subtitle = ({ startSubtitle, boldEndSubtitle }: Props) => {
  if (!startSubtitle && !boldEndSubtitle) return null

  const accessibilityLabel = [startSubtitle, boldEndSubtitle].filter(Boolean).join(' ')

  return (
    <Row
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={AccessibilityRole.TEXT}
      accessible>
      <Typo.Body>{startSubtitle}</Typo.Body>
      {boldEndSubtitle ? <Typo.BodyAccent>&nbsp;{boldEndSubtitle}</Typo.BodyAccent> : null}
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
})
