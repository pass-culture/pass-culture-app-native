import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { QuitSignupModal } from 'features/auth/signup/QuitSignupModal'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import { BottomContentPage } from 'ui/components/BottomContentPage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { CheckboxInput } from 'ui/components/inputs/CheckboxInput'
import { isEmailValid } from 'ui/components/inputs/emailCheck'
import { isValueEmpty } from 'ui/components/inputs/helpers'
import { InputError } from 'ui/components/inputs/InputError'
import { TextInput } from 'ui/components/inputs/TextInput'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Close } from 'ui/svg/icons/Close'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const SetEmail: FunctionComponent = () => {
  const [email, setEmail] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isNewsletterChecked, setIsNewsletterChecked] = useState(false)

  const navigation = useNavigation<UseNavigationType>()

  const shouldDisableValidateButton = isValueEmpty(email)

  const {
    visible: fullPageModalVisible,
    showModal: showFullPageModal,
    hideModal: hideFullPageModal,
  } = useModal(false)

  function onBackNavigation() {
    navigation.navigate('Home', { shouldDisplayLoginModal: true })
  }

  function onChangeEmail(email: string) {
    if (hasError) {
      setHasError(false)
    }
    setEmail(email)
  }

  async function validateEmail() {
    if (isEmailValid(email)) {
      navigation.navigate(`SetPassword`, { email, isNewsletterChecked })
    } else {
      setHasError(true)
    }
  }

  return (
    <React.Fragment>
      <BottomContentPage>
        <ModalHeader
          title={_(t`Ton email`)}
          leftIcon={ArrowPrevious}
          onLeftIconPress={onBackNavigation}
          rightIcon={Close}
          onRightIconPress={showFullPageModal}
        />
        <ModalContent>
          <StyledInput>
            <Typo.Body>{_(t`Adresse e-mail`)}</Typo.Body>
            <Spacer.Column numberOfSpaces={2} />
            <TextInput
              value={email}
              onChangeText={onChangeEmail}
              placeholder={_(/*i18n: email placeholder */ t`tonadresse@email.com`)}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={true}
            />
            <InputError
              visible={hasError}
              messageId="Format de l'e-mail incorrect"
              numberOfSpacesTop={1}
            />
          </StyledInput>
          <Spacer.Column numberOfSpaces={4} />
          <StyledCheckBox>
            <CheckboxInput isChecked={isNewsletterChecked} setIsChecked={setIsNewsletterChecked} />
            <CheckBoxText>
              {_(t`Reçois nos recommandations culturelles à proximité de chez toi par e-mail.`)}
            </CheckBoxText>
          </StyledCheckBox>
          <Spacer.Column numberOfSpaces={6} />
          <ButtonPrimary
            title={_(t`Continuer`)}
            onPress={validateEmail}
            isLoading={false}
            disabled={shouldDisableValidateButton}
          />
        </ModalContent>
      </BottomContentPage>
      <QuitSignupModal
        visible={fullPageModalVisible}
        resume={hideFullPageModal}
        testIdSuffix="birthday-information"
      />
    </React.Fragment>
  )
}

const ModalContent = styled.View({
  paddingTop: getSpacing(7),
  alignItems: 'center',
  width: '100%',
})

const CheckBoxText = styled(Typo.Body)({
  alignSelf: 'center',
  paddingLeft: getSpacing(4),
  paddingRight: getSpacing(20),
})

const StyledCheckBox = styled.View({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
})

const StyledInput = styled.View({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: getSpacing(125),
})
