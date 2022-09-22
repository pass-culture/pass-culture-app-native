import { t } from '@lingui/macro'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { OpenInboxButton } from 'features/auth/components/OpenInboxButton'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { env } from 'libs/environment'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
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
        title={t`E-mail de réinitialisation de mot de passe envoyé\u00a0!`}
        leftIconAccessibilityLabel={t`Revenir en arrière`}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIconAccessibilityLabel={t`Revenir à l'accueil`}
        rightIcon={Close}
        onRightIconPress={navigateToHome}
      />
      <ModalContent>
        <Description>
          <Typo.Body>{t`Clique sur le lien reçu à l’adresse\u00a0:`}</Typo.Body>
          <Typo.Body>{route.params.email}</Typo.Body>
          <Spacer.Column numberOfSpaces={5} />
          <CenteredText>
            <Typo.Body>
              {t`L’e-mail peut prendre quelques minutes à arriver. Pense à vérifier tes spams\u00a0!\n Si l’e-mail n’arrive pas, tu peux\u00a0: `}
            </Typo.Body>
          </CenteredText>
          <Spacer.Column numberOfSpaces={5} />
          <TouchableLink
            as={ButtonTertiaryPrimary}
            wording={t`Consulter l'article d'aide`}
            externalNav={{ url: env.FAQ_LINK_RESET_PASSORD_EMAIL_NOT_RECEIVED }}
            icon={ExternalSite}
          />
        </Description>
        {Platform.OS !== 'web' && <Spacer.Column numberOfSpaces={5} />}
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

const CenteredText = styled(Typo.Body)({
  textAlign: 'center',
})
