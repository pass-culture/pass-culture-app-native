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
      {!!boldEndSubtitle && <Typo.ButtonText>&nbsp;{boldEndSubtitle}</Typo.ButtonText>}
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})
