import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { TypoDS, getSpacing } from 'ui/theme'

type InfoCounterProps = {
  icon: ReactNode
  text: string
}

export const InfoCounter: FunctionComponent<InfoCounterProps> = ({ icon, text }) => {
  return (
    <Container gap={1}>
      {icon}
      <TypoDS.BodyAccentS>{text}</TypoDS.BodyAccentS>
    </Container>
  )
}

const Container = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: getSpacing(1),
})
