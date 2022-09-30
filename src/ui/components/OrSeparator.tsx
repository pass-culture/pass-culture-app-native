import React from 'react'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

export function OrSeparator() {
  return (
    <Container>
      <Line />
      <TextContainer>
        <OrText>ou</OrText>
      </TextContainer>
    </Container>
  )
}

const Container = styled.View({
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  marginVertical: getSpacing(6),
  alignSelf: 'stretch',
})

const Line = styled.View(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  height: 1,
  backgroundColor: theme.colors.greyMedium,
}))

const TextContainer = styled.View(({ theme }) => ({
  paddingHorizontal: 10,
  backgroundColor: theme.colors.white,
}))

const OrText = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.black,
}))
