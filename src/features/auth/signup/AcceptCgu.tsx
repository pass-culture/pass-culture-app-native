import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FC } from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { BottomCardContentContainer, BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { CtaText } from 'ui/components/buttons/CtaText'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { contactSupport } from '../support.services'

function openUrl(url: string) {
  if (Linking.canOpenURL(url)) {
    Linking.openURL(url)
  }
}

export const AcceptCgu: FC = () => {
  const { goBack, navigate } = useNavigation<UseNavigationType>()

  function goToCGU() {
    openUrl(env.CGU_LINK)
  }

  function goToPrivacyPolicy() {
    openUrl(env.PRIVACY_POLICY_LINK)
  }

  function subscribe() {
    // TODO: PC-5436
    navigate('SignupConfirmationEmailSent', { email: '' })
  }

  return (
    <BottomContentPage>
      <ModalHeader
        title={_(t`CGU & Données`)}
        leftIcon={ArrowPrevious}
        onLeftIconPress={goBack}
        rightIcon={Close}
      />
      <BottomCardContentContainer>
        <Spacer.Column numberOfSpaces={5} />
        <Paragraphe>
          <Typo.Body>{_(t`En cliquant sur “Accepter et s’inscrire”, tu acceptes nos `)}</Typo.Body>
          <CtaText
            title={_(t`Conditions Générales d'Utilisation`)}
            icon={ExternalSite}
            color={ColorsEnum.PRIMARY}
            iconSize={24}
            onPress={goToCGU}
          />
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body>{_(t` ainsi que notre `)}</Typo.Body>
          <CtaText
            title={_(t`Politique de confidentialité.`)}
            icon={ExternalSite}
            color={ColorsEnum.PRIMARY}
            iconSize={24}
            onPress={goToPrivacyPolicy}
          />
        </Paragraphe>
        <Spacer.Column numberOfSpaces={5} />
        <Paragraphe>
          <Typo.Body>
            {_(
              t`Pour en savoir plus sur la gestion de tes données personnelles et exercer tes droits tu peux :`
            )}
          </Typo.Body>
        </Paragraphe>
        <ButtonTertiary title={_(t`Contacter le support`)} onPress={contactSupport} icon={Email} />
        <Spacer.Column numberOfSpaces={6} />
        <ButtonPrimary title={_(t`Continuer`)} onPress={subscribe} />
      </BottomCardContentContainer>
    </BottomContentPage>
  )
}

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 1,
  textAlign: 'center',
})
