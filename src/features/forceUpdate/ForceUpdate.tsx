import { t } from '@lingui/macro'
import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { Background } from 'ui/svg/Background'
import { Star } from 'ui/svg/icons/Star'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const ANDROID_STORE_LINK = `https://play.google.com/store/apps/details?id:${env.ANDROID_APP_ID}`
const IOS_STORE_LINK = `https://apps.apple.com/us/app/pass-culture/id${env.IOS_APP_STORE_ID}`

const STORE_LINK = Platform.select({
  ios: IOS_STORE_LINK,
  android: ANDROID_STORE_LINK,
  default: ANDROID_STORE_LINK,
})

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
          <ButtonPrimaryWhite
            title={t`Télécharger la dernière version`}
            onPress={() => openExternalUrl(STORE_LINK)}
          />
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
