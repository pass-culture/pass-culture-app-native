import { t } from '@lingui/macro'
import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { openExternalUrl } from 'features/navigation/helpers'
import { env } from 'libs/environment'
import { Helmet } from 'libs/react-helmet/Helmet'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { Background } from 'ui/svg/Background'
import { Star } from 'ui/svg/icons/Star'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

const ANDROID_STORE_LINK = `https://play.google.com/store/apps/details?id=${env.ANDROID_APP_ID}`
const IOS_STORE_LINK = `https://apps.apple.com/fr/app/pass-culture/id${env.IOS_APP_STORE_ID}`

const STORE_LINK = Platform.select({
  ios: IOS_STORE_LINK,
  android: ANDROID_STORE_LINK,
  default: ANDROID_STORE_LINK,
})

const onPress = Platform.select({
  default: () => openExternalUrl(STORE_LINK),
  web: () => globalThis?.window?.location?.replace('/'),
})

const title = Platform.select({
  default: t`Mise à jour de l'application`,
  web: t`Mise à jour de l'application`,
})

const description = Platform.select({
  default: t`Le pass Culture ne semble plus à jour sur ton téléphone !
                Pour des questions de performance et de sécurité merci de télécharger la dernière version disponible.`,
  web: t`Le pass Culture de ton navigateur ne semble plus à jour !
                Pour des questions de performance et de sécurité merci d'actualiser la page pour obtenir la dernière version disponible.`,
})

const buttonText = Platform.select({
  default: t`Télécharger la dernière version`,
  web: t`Actualiser la page`,
})

export const ForceUpdate = () => {
  return (
    <Container>
      <Helmet title={title} />
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
            <Typo.Title2 color={ColorsEnum.WHITE}>{title}</Typo.Title2>
          </CenteredText>
          <Row>
            <TextContainer>
              <CenteredText>
                <Typo.Body color={ColorsEnum.WHITE}>{description}</Typo.Body>
              </CenteredText>
            </TextContainer>
          </Row>
        </ContentContainer>
        <ButtonContainer>
          <ButtonPrimaryWhite title={buttonText} onPress={onPress} />
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

const ButtonContainer = styled.View({
  flex: 0.5,
  width: '100%',
  alignItems: 'center',
})

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
