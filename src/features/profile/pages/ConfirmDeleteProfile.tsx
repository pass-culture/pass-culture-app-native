import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useNotifyAccountSuspend } from 'features/auth/api'
// import { contactSupport } from 'features/auth/support.services'
// import { useUserProfileInfo } from 'features/home/api'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { AppButton } from 'ui/components/buttons/AppButton'
import { Background } from 'ui/svg/Background'
import { Error } from 'ui/svg/icons/Error'
import { ColorsEnum, getSpacing, Spacer, Typo } from 'ui/theme'

export function ConfirmDeleteProfile() {
  // const { data: user } = useUserProfileInfo()
  // console.log('USER : ', user)
  const { mutate: notifyAccountSuspend } = useNotifyAccountSuspend()
  const { goBack } = useNavigation<UseNavigationType>()
  return (
    <Container>
      <Background />
      <Spacer.TopScreen />
      <Spacer.Flex />
      <Error />

      <CenteredContainer>
        <CenteredText>
          <Typo.Title2 color={ColorsEnum.WHITE}>
            {t`Es-tu sûr de vouloir supprimer ton compte ?`}
          </Typo.Title2>
        </CenteredText>

        <Spacer.Column numberOfSpaces={4} />

        <CenteredText>
          <Typo.Body color={ColorsEnum.WHITE}>
            {t`Tu as 30 jours pour te rétracter en envoyant un message à support@passculture.app`}
          </Typo.Body>
        </CenteredText>

        <Spacer.Column numberOfSpaces={4} />

        <CenteredText>
          <Typo.Body color={ColorsEnum.WHITE}>
            {t`Une fois ce délai écoulé, tes données seront supprimées de nos fichier`}
          </Typo.Body>
        </CenteredText>
      </CenteredContainer>

      <Spacer.Column numberOfSpaces={8} />

      <Row>
        <ButtonContainer>
          <AppButton
            title={t`Je supprime mon compte`}
            // onPress={() => contactSupport.forAccountDeletion(user.email)}
            onPress={notifyAccountSuspend}
            backgroundColor={ColorsEnum.WHITE}
            textColor={ColorsEnum.PRIMARY}
            loadingIconColor={ColorsEnum.PRIMARY}
            buttonHeight="tall"
          />
          <Spacer.Column numberOfSpaces={4} />
          <AppButton
            title={t`Abandonner`}
            onPress={goBack}
            backgroundColor={ColorsEnum.TRANSPARENT}
            textColor={ColorsEnum.WHITE}
            loadingIconColor={ColorsEnum.WHITE}
            buttonHeight="tall"
          />
        </ButtonContainer>
      </Row>
      <Spacer.Flex />
      <Spacer.BottomScreen />
    </Container>
  )
}

export default ConfirmDeleteProfile

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
})

const Row = styled.View({ flexDirection: 'row' })

const CenteredContainer = styled.View({
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginHorizontal: getSpacing(8),
})

const ButtonContainer = styled.View({ flex: 1, marginHorizontal: getSpacing(8) })

const CenteredText = styled.Text({
  textAlign: 'center',
})
