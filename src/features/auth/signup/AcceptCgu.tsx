import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { useSignUp } from 'features/auth/AuthContext'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { BottomCardContentContainer, BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ExternalLink } from 'ui/components/buttons/ExternalLink'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { contactSupport } from '../support.services'

type Props = StackScreenProps<RootStackParamList, 'AcceptCgu'>

export const AcceptCgu: FC<Props> = ({ route }) => {
  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const signUp = useSignUp()
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked
  const password = route.params.password
  const birthday = route.params.birthday

  async function subscribe() {
    await signUp({
      password: password,
      birthdate: birthday,
      hasAllowedRecommendations: isNewsletterChecked,
      token: 'ABCDEF',
      email: email,
    })
    navigate('SignupConfirmationEmailSent', { email: email })
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
          <ExternalLink
            text={_(t`Conditions Générales d'Utilisation`)}
            url={env.CGU_LINK}
            color={ColorsEnum.PRIMARY}
          />
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body>{_(t` ainsi que notre `)}</Typo.Body>
          <ExternalLink
            text={_(t`Politique de confidentialité.`)}
            color={ColorsEnum.PRIMARY}
            url={env.PRIVACY_POLICY_LINK}
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
        <ButtonPrimary title={_(t`Accepter et s’inscrire`)} onPress={subscribe} />
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
