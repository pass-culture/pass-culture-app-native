import React from 'react'
import styled from 'styled-components/native'

import { BicolorWarning } from 'ui/svg/icons/BicolorWarning'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  text: string
}

export const BottomBanner = ({ text }: Props) => {
  return (
    <Container>
      <IconContainer>
        <BicolorWarning />
      </IconContainer>
      <Spacer.Row numberOfSpaces={4.5} />
      <Typo.Body>{text}</Typo.Body>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  borderTopColor: theme.colors.greyMedium,
  borderTopWidth: getSpacing(0.25),
  padding: getSpacing(4),
  flexDirection: 'row',
  alignItems: 'center',
}))

const IconContainer = styled.View({
  flexShrink: 0,
})
