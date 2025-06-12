import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

export const cheatcodesNavigationIdentityCheckButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'IdentityCheck 🎨',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationIdentityCheck' },
    subscreens: [
      { screen: 'BeneficiaryRequestSent' },
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesScreenNotEligibleEduConnect' },
        title: 'NotEligibleEduConnect',
      },
      { screen: 'ComeBackLater' },
      { screen: 'DisableActivation' },
      { screen: 'DMSIntroduction' },
      { screen: 'EduConnectForm' },
      { screen: 'ExpiredOrLostID' },
      { screen: 'IdentificationFork' },
      { screen: 'IdentityCheckDMS' },
      { screen: 'IdentityCheckEnd' },
      { screen: 'IdentityCheckHonor' },
      { screen: 'IdentityCheckPending' },
      { screen: 'IdentityCheckUnavailable' },
      { screen: 'PhoneValidationTooManyAttempts' },
      { screen: 'PhoneValidationTooManySMSSent' },
      { screen: 'SelectIDOrigin' },
      { screen: 'SelectIDStatus' },
      { screen: 'SelectPhoneStatus' },
      { screen: 'ProfileInformationValidation' },
      { screen: 'SetAddress', navigationParams: { type: ProfileTypes.IDENTITY_CHECK } },
      { screen: 'SetCity', navigationParams: { type: ProfileTypes.IDENTITY_CHECK } },
      { screen: 'SetName', navigationParams: { type: ProfileTypes.IDENTITY_CHECK } },
      { screen: 'SetPhoneNumber' },
      { screen: 'SetPhoneNumberWithoutValidation' },
      { screen: 'SetPhoneValidationCode' },
      { screen: 'SetStatus', navigationParams: { type: ProfileTypes.IDENTITY_CHECK } },
      { screen: 'Stepper' },
      { screen: 'VerifyEligibility' },
      { title: 'DuplicateUser Error', showOnlyInSearch: true },
      { title: 'Generic Error', showOnlyInSearch: true },
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesNavigationNewIdentificationFlow' },
        title: 'NewIdentificationFlow 🎨',
      },
      { title: 'PhoneValidationTipsModal', showOnlyInSearch: true },
      { title: 'UserAgeNotValid Educonnect Error', showOnlyInSearch: true },
      { title: 'UserAgeNotValid18YearsOld Error', showOnlyInSearch: true },
      { title: 'UserTypeNotStudent Error', showOnlyInSearch: true },
      {
        screen: 'SetProfileBookingError',
        title: 'SetProfileBookingError with offer',
        navigationParams: { offerId: 1 },
      },
      {
        screen: 'SetProfileBookingError',
        title: 'SetProfileBookingError without offer',
        navigationParams: { offerId: undefined },
      },
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

      <LinkToCheatcodesScreen
        title="PhoneValidation tips Modal"
        onPress={() => setPhoneValidationTipsModalVisible(true)}
      />
      <PhoneValidationTipsModal
        isVisible={phoneValidationTipsModalVisible}
        dismissModal={() => setPhoneValidationTipsModalVisible(false)}
        onGoBack={() =>
          navigate('CheatcodesStackNavigator', { screen: 'CheatcodesNavigationIdentityCheck' })
        }
      />

      <LinkToCheatcodesScreen
        title="UserAgeNotValid Educonnect Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid)}
      />

      <LinkToCheatcodesScreen
        title="UserAgeNotValid18YearsOld Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld)}
      />

      <LinkToCheatcodesScreen
        title="UserTypeNotStudent Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.UserTypeNotStudent)}
      />

      <LinkToCheatcodesScreen
        title="DuplicateUser Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.DuplicateUser)}
      />

      <LinkToCheatcodesScreen
        title="Generic Error"
        onPress={() => trigger(EduConnectErrorMessageEnum.GenericError)}
      />
    </CheatcodesTemplateScreen>
  )
}
