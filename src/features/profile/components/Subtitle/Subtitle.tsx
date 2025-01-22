import React from 'react'
import styled from 'styled-components/native'

import { TypoDS } from 'ui/theme'

type Props = {
  startSubtitle: string
  boldEndSubtitle?: string
}

export const Subtitle = ({ startSubtitle, boldEndSubtitle }: Props) => {
  return (
    <Row>
      <TypoDS.Body>{startSubtitle}</TypoDS.Body>
      {boldEndSubtitle ? <TypoDS.BodyAccent>&nbsp;{boldEndSubtitle}</TypoDS.BodyAccent> : null}
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
})
