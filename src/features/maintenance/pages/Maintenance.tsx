import React from 'react'
import styled from 'styled-components/native'

import { Helmet } from 'libs/react-helmet/Helmet'
import { getPrimaryIllustration } from 'shared/illustrations/getPrimaryIllustration'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Page } from 'ui/pages/Page'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type MaintenanceProps = {
  message?: string
}

export const Maintenance: React.FC<MaintenanceProps> = (props) => {
  const helmetTitle = 'Maintenance | pass Culture'
  const Illustration = getPrimaryIllustration(MaintenanceCone)

  return (
    <React.Fragment>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>
      <Page>
        <Container>
          <Spacer.Flex flex={1} />
          <IllustrationContainer>{Illustration ? <Illustration /> : null}</IllustrationContainer>
          <TextContainer gap={4}>
            <StyledTitle2 {...getHeadingAttrs(1)}>Maintenance en cours</StyledTitle2>
            <StyledBody {...getHeadingAttrs(2)}>
              {props.message
                ? props.message
                : 'L’application est actuellement en maintenance, mais sera à nouveau en ligne rapidement\u00a0!'}
            </StyledBody>
          </TextContainer>
          <Spacer.Flex flex={1} />
        </Container>
      </Page>
    </React.Fragment>
  )
}

const Container = styled.View<{ top: number; bottom: number }>(({ theme }) => ({
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
  overflow: 'scroll',
}))

const IllustrationContainer = styled.View<{ animation: boolean }>(({ animation }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: getSpacing(6),
  ...(animation && { height: '30%' }),
}))

const TextContainer = styled(ViewGap)({
  alignItems: 'center',
  marginBottom: getSpacing(6),
})

const StyledTitle2 = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
