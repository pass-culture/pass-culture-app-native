import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { Background } from 'ui/svg/Background'
import { LogoPassCulture } from 'ui/svg/icons/LogoPassCulture'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const Maintenance = () => {
  return (
    <Container>
      <Background />
      <Spacer.Flex />
      <Spacer.Column numberOfSpaces={10} />
      <MaintenanceCone />
      <ContentContainer>
        <CenteredText>
          <Typo.Title1 color={ColorsEnum.WHITE} numberOfLines={2}>
            {_(t`Maintenance en cours`)}
          </Typo.Title1>
        </CenteredText>
        <Spacer.Column numberOfSpaces={4} />

        <Row>
          <TextContainer>
            <CenteredText>
              <Typo.Body color={ColorsEnum.WHITE}>
                {_(
                  t`L’application est actuellement en maintenance, mais sera à nouveau en ligne rapidement !`
                )}
              </Typo.Body>
            </CenteredText>
          </TextContainer>
        </Row>
      </ContentContainer>
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

const Row = styled.View({ flexDirection: 'row' })

const TextContainer = styled.View({ maxWidth: getSpacing(88) })

const CenteredText = styled.Text({
  textAlign: 'center',
})

const ContentContainer = styled.View({ paddingHorizontal: getSpacing(15), alignItems: 'center' })
