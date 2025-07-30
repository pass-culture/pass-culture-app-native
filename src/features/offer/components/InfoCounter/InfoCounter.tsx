import React, { FunctionComponent, ReactNode } from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

type InfoCounterProps = {
  icon: ReactNode
  text: string
}

export const InfoCounter: FunctionComponent<InfoCounterProps> = ({ icon, text }) => {
  return (
    <Container gap={1}>
      {icon}
      <Typo.BodyAccentS>{text}</Typo.BodyAccentS>
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: theme.designSystem.size.spacing.xs,
}))
