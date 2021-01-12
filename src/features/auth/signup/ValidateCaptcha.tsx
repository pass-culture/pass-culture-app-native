import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { ReCaptchaV2 } from 'features/auth/ReCaptchaV2'
import { QuitSignupModal, SignupSteps } from 'features/auth/signup/QuitSignupModal'
import { RootStackParamList, UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ExternalLink } from 'ui/components/buttons/externalLink/ExternalLink'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { Spacer } from 'ui/components/spacer/Spacer'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { ColorsEnum } from 'ui/theme/colors'
import { getSpacing } from 'ui/theme/spacing'
import { Typo } from 'ui/theme/typography'

type Props = StackScreenProps<RootStackParamList, 'ValidateCaptcha'>

export const ValidateCaptcha: FunctionComponent<Props> = ({ route }) => {
  const { goBack, navigate } = useNavigation<UseNavigationType>()
  const [reCaptchaToken, setReCaptchaToken] = useState('')
  const [isCaptchaValidated, setIsCaptchaValidated] = useState(false)
  const email = route.params.email
  const isNewsletterChecked = route.params.isNewsletterChecked
  const password = route.params.password
  const birthday = route.params.birthday

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function onReceiveToken(token: string) {
    setReCaptchaToken(token)
    setIsCaptchaValidated(true)
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={_(t`Es-tu un robot ?`)}
          leftIcon={ArrowPrevious}
          onLeftIconPress={goBack}
          rightIcon={Close}
          onRightIconPress={showFullPageModal}
        />
        <BottomCardContent>
          <Spacer.Column numberOfSpaces={7} />
          <Typo.Body>{_(t`Valide le capcha pour continuer.`)}</Typo.Body>
          <Spacer.Column numberOfSpaces={4} />
          <ReCaptchaV2 onReceiveToken={(token) => onReceiveToken(token)} />
          <Paragraphe>
            <Typo.Body>
              {_(
                /*i18n: signup birthday page reCAPTCHA */ t`Ce site est protégé par reCAPTCHA Google. La`
              )}
            </Typo.Body>
            <ExternalLink
              text={_(t`Charte des Données Personnelles`)}
              url={'https://policies.google.com/privacy'}
              color={ColorsEnum.PRIMARY}
              testID="external-link-google-data-privacy"
            />
            <Spacer.Row numberOfSpaces={1} />
            <Typo.Body>{_(/*i18n: signup birthday page reCAPTCHA */ t`et les`)}</Typo.Body>
            <ExternalLink
              text={_(t`Conditions Générales d'Utilisation`)}
              url={'https://policies.google.com/terms'}
              color={ColorsEnum.PRIMARY}
              testID="external-link-google-cgu"
            />
            <Spacer.Row numberOfSpaces={1} />
            <Typo.Body>{_(/*i18n: signup birthday page reCAPTCHA */ t` s'appliquent.`)}</Typo.Body>
          </Paragraphe>
          <ButtonPrimary
            title={_(t`Continuer`)}
            disabled={!isCaptchaValidated}
            testIdSuffix={'validate-birthday'}
            onPress={() =>
              navigate('AcceptCgu', {
                email: email,
                isNewsletterChecked: isNewsletterChecked,
                password: password,
                birthday: birthday,
                reCaptchaToken: reCaptchaToken,
              })
            }
          />
        </BottomCardContent>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="birthday-quit-signup"
        signupStep={SignupSteps.Captcha}
      />
    </React.Fragment>
  )
}

const BottomCardContent = styled.View({
  width: '100%',
  alignItems: 'center',
})

const Paragraphe = styled.Text({
  flexWrap: 'wrap',
  alignItems: 'center',
  alignSelf: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  marginVertical: getSpacing(8),
})
