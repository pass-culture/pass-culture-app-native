import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
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
      <LinkToComponent
        title="NewIdentificationFlow 🎨"
        onPress={() => navigate('CheatcodesNavigationNewIdentificationFlow')}
      />
      <LinkToComponent name="Stepper" title="Stepper" />
      <LinkToComponent
        title="Too many codes"
        onPress={() => navigate('PhoneValidationTooManyAttempts')}
      />
      <LinkToComponent
        title="Too many SMS sent"
        onPress={() => navigate('PhoneValidationTooManySMSSent')}
      />

      <LinkToComponent name="SetPhoneNumber" title="new SetPhoneNumber" />
      <LinkToComponent name="SetPhoneNumberWithoutValidation" />
      <LinkToComponent
        title="PhoneValidation tips Modal"
        onPress={() => setPhoneValidationTipsModalVisible(true)}
      />
      <LinkToComponent
        title="New SetPhoneValidationCode"
        onPress={() => navigate('SetPhoneValidationCode')}
      />
      <LinkToComponent name="SetStatus" title="SetStatus" />
      <LinkToComponent name="IdentityCheckUnavailable" />
      <LinkToComponent name="IdentityCheckPending" />
      <LinkToComponent name="SetName" />
      <LinkToComponent name="SetAddress" title="SetAddress" />
      <LinkToComponent name="SetCity" title="SetCity" />
      <LinkToComponent name="IdentityCheckEnd" />
      <LinkToComponent name="IdentityCheckHonor" />
      <LinkToComponent name="EduConnectForm" />
      <LinkToComponent name="IdentityCheckDMS" />
      <LinkToComponent
        name="EduConnectValidation"
        navigationParams={{
          firstName: 'firstName',
          lastName: 'lastName',
          dateOfBirth: '2021-12-01',
        }}
      />
      <LinkToComponent
        title="UserAgeNotValid Educonnect Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid)}
      />
      <LinkToComponent
        title="UserAgeNotValid18YearsOld Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld)}
      />
      <LinkToComponent
        title="UserTypeNotStudent Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserTypeNotStudent)}
      />
      <LinkToComponent
        title="DuplicateUser Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.DuplicateUser)}
      />
      <LinkToComponent
        title="Generic Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.GenericError)}
      />
      <LinkToComponent title="VerifyEligibility" onPress={() => navigate('VerifyEligibility')} />
      <LinkToComponent
        title="Beneficiary request sent"
        onPress={() => navigate('BeneficiaryRequestSent')}
      />
      <LinkToComponent name="IdentificationFork" />
      <Spacer.BottomScreen />
      <PhoneValidationTipsModal
        isVisible={phoneValidationTipsModalVisible}
        dismissModal={() => setPhoneValidationTipsModalVisible(false)}
        onGoBack={() => navigate('CheatcodesNavigationIdentityCheck')}
      />
    </CheatcodesTemplateScreen>
  )
}
