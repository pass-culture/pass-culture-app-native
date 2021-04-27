import React from 'react'
import styled from 'styled-components/native'

import { Background } from 'ui/svg/Background'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { Spacer } from 'ui/theme'

export const ForceUpdate = () => {
  return (
    <Container>
      <Background />
      <Spacer.Flex />
      <Spacer.Column numberOfSpaces={10} />
      <Spacer.Flex />
      <LogoPassCulture />
      <Spacer.Column numberOfSpaces={6} />
      <Spacer.BottomScreen />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})
