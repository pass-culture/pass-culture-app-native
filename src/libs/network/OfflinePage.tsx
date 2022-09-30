import React from 'react'
import styled from 'styled-components/native'

import { BicolorBrokenConnection } from 'ui/svg/BicolorBrokenConnection'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const OfflinePage = () => {
  return (
    <Container>
      <Content>
        <Spacer.TopScreen />
        <Spacer.Flex />
        <BicolorBrokenConnection size={getSpacing(46)} />
        <Spacer.Column numberOfSpaces={5} />
        <StyledTitle2>Pas de réseau internet</StyledTitle2>
        <Spacer.Column numberOfSpaces={4} />
        <StyledBody>Tu n’es pas connecté à internet.</StyledBody>
        <Spacer.Column numberOfSpaces={5} />
        <Spacer.Flex />
        <Spacer.BottomScreen />
      </Content>
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const StyledTitle2 = styled(Typo.Title2).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body).attrs(() => getHeadingAttrs(2))({
  textAlign: 'center',
})

const Content = styled.View({
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: getSpacing(4),
  maxWidth: getSpacing(90),
})
