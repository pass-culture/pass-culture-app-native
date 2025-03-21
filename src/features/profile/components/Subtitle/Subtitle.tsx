import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

type Props = {
  startSubtitle: string
  boldEndSubtitle?: string
}

export const Subtitle = ({ startSubtitle, boldEndSubtitle }: Props) => {
  return (
    <Row>
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
