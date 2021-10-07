import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OpenInboxButton } from 'features/auth/components/OpenInboxButton'
import { navigateToHome, openExternalUrl } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { padding, Spacer, Typo } from 'ui/theme'

type Props = StackScreenProps<RootStackParamList, 'ResetPasswordEmailSent'>

export const ResetPasswordEmailSent: FunctionComponent<Props> = ({ route }) => {
  const { goBack } = useGoBack('Login', undefined)
  return (
    <BottomContentPage>
      <ModalHeader
        title={t`E-mail envoyé !`}
        leftIconAccessibilityLabel={t`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={t`Revenir à l'accueil`}
        rightIcon={Close}
        onRightIconPress={navigateToHome}
      />
      <ModalContent>
        <Description>
          <Typo.Body>{t`Clique sur le lien reçu à l'adresse :`}</Typo.Body>
          <Typo.Body>{route.params.email}</Typo.Body>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>
              {t`L'e-mail peut prendre quelques minutes à arriver. Pense à vérifier tes spams !`}
            </Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <ButtonTertiary
            title={t`Consulter l'article d'aide`}
            onPress={() =>
              openExternalUrl(
                'https://aide.passculture.app/fr/articles/5261997-je-n-ai-pas-recu-le-mail-de-confirmation-de-changement-de-mot-de-passe'
              )
            }
            icon={ExternalSite}
          />
        </Description>
        <Spacer.Column numberOfSpaces={3} />
        <OpenInboxButton />
      </ModalContent>
    </BottomContentPage>
  )
}

const ModalContent = styled.View({
  ...padding(4, 1),
  alignItems: 'center',
  width: '100%',
})

const Description = styled.View({
  alignItems: 'center',
})

const CenteredText = styled.Text({
  textAlign: 'center',
})
