import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'
import { Spacer } from 'ui/theme'

export function CheatcodesNavigationIdentityCheck(): React.JSX.Element {
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [phoneValidationTipsModalVisible, setPhoneValidationTipsModalVisible] = useState(false)
  const { navigate } = useNavigation<UseNavigationType>()
  const { logType } = useLogTypeFromRemoteConfig()

  const trigger = (message: EduConnectErrorMessageEnum) => {
    setScreenError(
      new ScreenError(message, {
        Screen: NotEligibleEduConnect,
        logType,
      })
    )
  }

  if (screenError) throw screenError

  return (
    <CheatcodesTemplateScreen title="IdentityCheck 🎨">
      <LinkToScreen
        title="NewIdentificationFlow 🎨"
        screen="CheatcodesNavigationNewIdentificationFlow"
      />
      <LinkToScreen screen="Stepper" />
      <LinkToScreen screen="PhoneValidationTooManyAttempts" />
      <LinkToScreen screen="PhoneValidationTooManySMSSent" />
      <LinkToScreen screen="SetPhoneNumber" />
      <LinkToScreen screen="SetPhoneNumberWithoutValidation" />
      <LinkToScreen
        title="PhoneValidation tips Modal"
        onPress={() => setPhoneValidationTipsModalVisible(true)}
      />
      <LinkToScreen screen="SetPhoneValidationCode" />
      <LinkToScreen screen="SetStatus" />
      <LinkToScreen screen="IdentityCheckUnavailable" />
      <LinkToScreen screen="IdentityCheckPending" />
      <LinkToScreen screen="SetName" />
      <LinkToScreen screen="SetAddress" />
      <LinkToScreen screen="SetCity" />
      <LinkToScreen screen="IdentityCheckEnd" />
      <LinkToScreen screen="IdentityCheckHonor" />
      <LinkToScreen screen="EduConnectForm" />
      <LinkToScreen screen="IdentityCheckDMS" />
      <LinkToScreen
        screen="EduConnectValidation"
        navigationParams={{
          firstName: 'firstName',
          lastName: 'lastName',
          dateOfBirth: '2021-12-01',
        }}
      />
      <LinkToScreen
        title="UserAgeNotValid Educonnect Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid)}
      />
      <LinkToScreen
        title="UserAgeNotValid18YearsOld Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld)}
      />
      <LinkToScreen
        title="UserTypeNotStudent Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserTypeNotStudent)}
      />
      <LinkToScreen
        title="DuplicateUser Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.DuplicateUser)}
      />
      <LinkToScreen
        title="Generic Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.GenericError)}
      />
      <LinkToScreen screen="VerifyEligibility" />
      <LinkToScreen screen="BeneficiaryRequestSent" />
      <LinkToScreen screen="IdentificationFork" />
      <Spacer.BottomScreen />
      <PhoneValidationTipsModal
        isVisible={phoneValidationTipsModalVisible}
        dismissModal={() => setPhoneValidationTipsModalVisible(false)}
        onGoBack={() => navigate('CheatcodesNavigationIdentityCheck')}
      />
    </CheatcodesTemplateScreen>
  )
}
