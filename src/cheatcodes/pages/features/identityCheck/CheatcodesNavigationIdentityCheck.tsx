import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'
import { Spacer } from 'ui/theme'

export const cheatcodesNavigationIdentityCheckButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'IdentityCheck 🎨',
    screen: 'CheatcodesNavigationIdentityCheck',
    subscreens: [
      { title: 'NewIdentificationFlow 🎨', screen: 'CheatcodesNavigationNewIdentificationFlow' },
      { screen: 'Stepper' },
      { screen: 'PhoneValidationTooManyAttempts' },
      { screen: 'PhoneValidationTooManySMSSent' },
      { screen: 'SetPhoneNumber' },
      { screen: 'SetPhoneNumberWithoutValidation' },
      { screen: 'SetPhoneValidationCode' },
      { screen: 'SetStatus' },
      { screen: 'IdentityCheckUnavailable' },
      { screen: 'IdentityCheckPending' },
      { screen: 'SetName' },
      { screen: 'SetAddress' },
      { screen: 'SetCity' },
      { screen: 'IdentityCheckEnd' },
      { screen: 'IdentityCheckHonor' },
      { screen: 'EduConnectForm' },
      { screen: 'IdentityCheckDMS' },
      { screen: 'VerifyEligibility' },
      { screen: 'BeneficiaryRequestSent' },
      { screen: 'IdentificationFork' },
      {
        screen: 'EduConnectValidation',
        navigationParams: {
          firstName: 'firstName',
          lastName: 'lastName',
          dateOfBirth: '2021-12-01',
        },
      },
    ],
  },
]

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
    <CheatcodesTemplateScreen title={cheatcodesNavigationIdentityCheckButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationIdentityCheckButtons} />

      <LinkToScreen
        title="PhoneValidation tips Modal"
        onPress={() => setPhoneValidationTipsModalVisible(true)}
      />
      <PhoneValidationTipsModal
        isVisible={phoneValidationTipsModalVisible}
        dismissModal={() => setPhoneValidationTipsModalVisible(false)}
        onGoBack={() => navigate('CheatcodesNavigationIdentityCheck')}
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
      <Spacer.BottomScreen />
    </CheatcodesTemplateScreen>
  )
}
