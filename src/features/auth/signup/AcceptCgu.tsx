import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components/native'

import { QuitSignupModal, SignupSteps } from 'features/auth/signup/QuitSignupModal'
import { AsyncError } from 'features/errors/pages/AsyncErrorBoundary'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { env } from 'libs/environment'
import { _ } from 'libs/i18n'
import { BottomCardContentContainer, BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiary } from 'ui/components/buttons/ButtonTertiary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { StepDots } from 'ui/components/StepDots'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { Email } from 'ui/svg/icons/Email'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

import { useSignUp } from '../api'
import { contactSupport } from '../support.services'

type Props = StackScreenProps<RootStackParamList, 'AcceptCgu'>

export const AcceptCgu: FC<Props> = ({ route }) => {
  const isMounted = useRef(false)
  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const signUp = useSignUp()
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked
  const password = route.params.password
  const birthday = route.params.birthday
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  const { refetch, isFetching } = useQuery('subscribe', subscribeQuery, {
    cacheTime: 0,
    enabled: false,
    onSuccess: (success) => {
      if (success) {
        navigate('SignupConfirmationEmailSent', { email: email })
      }
    },
  })
  async function subscribeQuery() {
    const signupResponse = await signUp({
      password: password,
      birthdate: birthday,
      hasAllowedRecommendations: isNewsletterChecked,
      token: 'ABCDEF',
      email: email,
    })
    if (!signupResponse?.isSuccess) {
      throw new AsyncError('NETWORK_REQUEST_FAILED', refetch)
    }
    return true
  }
  async function handleSubscribe() {
    return refetch()
  }
  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={_(t`CGU & Données`)}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIcon={Close}
          onRightIconPress={showFullPageModal}
        />
        <BottomCardContentContainer>
          <CardContent>
            <Spacer.Column numberOfSpaces={5} />
            <Paragraphe>
              <Typo.Body>
                {_(t`En cliquant sur “Accepter et s’inscrire”, tu acceptes nos `)}
              </Typo.Body>
              <ExternalLink
                text={_(t`Conditions Générales d'Utilisation`)}
                url={env.CGU_LINK}
                color={ColorsEnum.PRIMARY}
                testID="external-link-cgu"
              />
              <Spacer.Row numberOfSpaces={1} />
              <Typo.Body>{_(t` ainsi que notre `)}</Typo.Body>
              <ExternalLink
                text={_(t`Politique de confidentialité.`)}
                color={ColorsEnum.PRIMARY}
                url={env.PRIVACY_POLICY_LINK}
                testID="external-link-privacy-policy"
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
            <ButtonTertiary
              title={_(t`Contacter le support`)}
              onPress={contactSupport.forGenericQuestion}
              icon={Email}
            />
            <Spacer.Column numberOfSpaces={6} />
            <ButtonPrimary
              title={_(t`Accepter et s’inscrire`)}
              onPress={handleSubscribe}
              disabled={isFetching}
            />
            <Spacer.Column numberOfSpaces={5} />
            <StepDots numberOfSteps={4} currentStep={4} />
          </CardContent>
        </BottomCardContentContainer>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="cgu-quit-signup"
        signupStep={SignupSteps.CGU}
      />
    </React.Fragment>
  )
}

const CardContent = styled.View({
  width: '100%',
  alignItems: 'center',
})

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  flexShrink: 1,
  textAlign: 'center',
})
