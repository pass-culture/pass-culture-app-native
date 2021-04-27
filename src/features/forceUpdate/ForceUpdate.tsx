import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { Background } from 'ui/svg/Background'
import { Star } from 'ui/svg/icons/Star'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export const ForceUpdate = () => {
  return (
    <Container>
      <Background />
      <IconContainer>
        <Spacer.Flex />
        <Spacer.Flex>
          <Star />
        </Spacer.Flex>
        <Spacer.Flex />
      </IconContainer>
      <PageContainer>
        <ContentContainer>
          <CenteredText>
            <Typo.Title2 color={ColorsEnum.WHITE}>{t`Mise à jour de l'application`}</Typo.Title2>
          </CenteredText>
          <Row>
            <TextContainer>
              <CenteredText>
                <Typo.Body color={ColorsEnum.WHITE}>
                  {t`Le Pass Culture ne semble plus à jour sur ton téléphone !
                Pour des questions de performances et de sécurité merci de télécharger la dernière version disponible.`}
                </Typo.Body>
              </CenteredText>
            </TextContainer>
          </Row>
        </ContentContainer>
        <ButtonContainer>
          <ButtonPrimaryWhite title={t`Télécharger la dernière version`} onPress={() => {}} />
        </ButtonContainer>
      </PageContainer>
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

const IconContainer = styled.View({ justifyContent: 'center', flex: 1 })
const ButtonContainer = styled.View({ flex: 0.5, width: '100%' })

const PageContainer = styled.View({
  alignItems: 'center',
  flex: 1.5,
  justifyContent: 'space-evenly',
  width: '100%',
  paddingHorizontal: getSpacing(4),
})

const ContentContainer = styled.View({
  justifyContent: 'space-evenly',
  flex: 1,
  paddingHorizontal: getSpacing(4),
})
