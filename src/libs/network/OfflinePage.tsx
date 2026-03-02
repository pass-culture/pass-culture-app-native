import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { BrokenConnection as InitialBrokenConnection } from 'ui/svg/BrokenConnection'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const OfflinePage = () => {
  return (
    <Container>
      <Content>
        <Spacer.TopScreen />
        <Spacer.Flex />
        <BrokenConnection />
        <StyledViewGap gap={4}>
          <StyledTitle2>Pas de réseau internet</StyledTitle2>
          <StyledBody>Tu n’es pas connecté à internet.</StyledBody>
        </StyledViewGap>
        <Spacer.Flex />
        <Spacer.BottomScreen />
      </Content>
    </Container>
  )
}
const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
const BrokenConnection = styled(InitialBrokenConnection).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const Container = styled(Page)({
  alignItems: 'center',
})

const StyledTitle2 = styled(Typo.Title2).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body).attrs(() => getHeadingAttrs(2))({
  textAlign: 'center',
})

const Content = styled.View(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.l,
  maxWidth: getSpacing(90),
}))
