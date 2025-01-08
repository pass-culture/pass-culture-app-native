import React from 'react'
import styled from 'styled-components/native'

import { Typo, TypoDS } from 'ui/theme'

type Props = {
  startSubtitle: string
  boldEndSubtitle?: string
}

export const Subtitle = ({ startSubtitle, boldEndSubtitle }: Props) => {
  return (
    <Row>
      <TypoDS.Body>{startSubtitle}</TypoDS.Body>
      {boldEndSubtitle ? <Typo.ButtonText>&nbsp;{boldEndSubtitle}</Typo.ButtonText> : null}
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
})
