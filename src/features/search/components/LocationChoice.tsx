import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  text: string
  icon: JSX.Element
}

export const LocationChoice: React.FC<Props> = ({ text, icon }) => {
  return (
    <Container>
      {icon}
      <Spacer.Row numberOfSpaces={2} />
      <Typo.ButtonText>{text}</Typo.ButtonText>
    </Container>
  )
}

const Container = styled(View)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: getSpacing(6),
})
