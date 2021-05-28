import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { AppButton } from 'ui/components/buttons/AppButton'
import { Background } from 'ui/svg/Background'
import { ProfileDeletionLight } from 'ui/svg/icons/ProfileDeletionLight'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function DeleteProfileSuccess() {
  return (
    <Container>
      <Background />
      <Spacer.TopScreen />
      <Spacer.Flex />
      <ProfileDeletionLight />

      <Spacer.Column numberOfSpaces={6} />

      <CenteredContainer>
        <CenteredText>
          <Typo.Title2 color={ColorsEnum.WHITE}>{t`Compte désactivé`}</Typo.Title2>
        </CenteredText>

        <Spacer.Column numberOfSpaces={4} />

        <CenteredText>
          <Typo.Body color={ColorsEnum.WHITE}>
            {t`Tu as 30 jours pour te rétracter par e-mail à : support@passculture.app`}
          </Typo.Body>
        </CenteredText>

        <Spacer.Column numberOfSpaces={4} />

        <CenteredText>
          <Typo.Body color={ColorsEnum.WHITE}>
            {t`Une fois ce délai écoulé, ton compte pass Culture sera définitivement supprimé.`}
          </Typo.Body>
        </CenteredText>
      </CenteredContainer>

      <Spacer.Flex />

      <Row>
        <ButtonContainer>
          <AppButton
            title={t`Retourner à l'accueil`}
            onPress={navigateToHome}
            backgroundColor={ColorsEnum.WHITE}
            textColor={ColorsEnum.PRIMARY}
            loadingIconColor={ColorsEnum.PRIMARY}
            buttonHeight="small"
          />
        </ButtonContainer>
      </Row>
      <Spacer.BottomScreen />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Row = styled.View({ flexDirection: 'row' })

const CenteredContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginHorizontal: getSpacing(6),
})

const ButtonContainer = styled.View({
  flex: 1,
  marginHorizontal: getSpacing(6),
  paddingBottom: getSpacing(6),
})

const CenteredText = styled.Text({
  textAlign: 'center',
})
