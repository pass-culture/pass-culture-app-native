// cheatcodes/pages/features/identityCheck/CheatcodesNavigationIdentityCheck.tsx (Refactored)

import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'
import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
// --- Import the custom navigation hooks and types ---
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

// --- We define a single, well-typed category object ---
export const identityCheckCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'IdentityCheck 🎨',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationIdentityCheck' },
  },
  // The subscreens are now all valid, structured CheatcodeButtons
  subscreens: [
    {
      id: uuidv4(),
      title: 'BeneficiaryRequestSent',
      navigationTarget: { screen: 'BeneficiaryRequestSent' },
    },
    {
      id: uuidv4(),
      title: 'NotEligibleEduConnect',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenNotEligibleEduConnect' },
      },
    },
    { id: uuidv4(), title: 'ComeBackLater', navigationTarget: { screen: 'ComeBackLater' } },
    { id: uuidv4(), title: 'DisableActivation', navigationTarget: { screen: 'DisableActivation' } },
    { id: uuidv4(), title: 'DMSIntroduction', navigationTarget: { screen: 'DMSIntroduction' } },
    { id: uuidv4(), title: 'EduConnectForm', navigationTarget: { screen: 'EduConnectForm' } },
    { id: uuidv4(), title: 'ExpiredOrLostID', navigationTarget: { screen: 'ExpiredOrLostID' } },
    {
      id: uuidv4(),
      title: 'IdentificationFork',
      navigationTarget: { screen: 'IdentificationFork' },
    },
    { id: uuidv4(), title: 'IdentityCheckDMS', navigationTarget: { screen: 'IdentityCheckDMS' } },
    { id: uuidv4(), title: 'IdentityCheckEnd', navigationTarget: { screen: 'IdentityCheckEnd' } },
    {
      id: uuidv4(),
      title: 'IdentityCheckHonor',
      navigationTarget: { screen: 'IdentityCheckHonor' },
    },
    {
      id: uuidv4(),
      title: 'IdentityCheckPending',
      navigationTarget: { screen: 'IdentityCheckPending' },
    },
    {
      id: uuidv4(),
      title: 'IdentityCheckUnavailable',
      navigationTarget: { screen: 'IdentityCheckUnavailable' },
    },
    {
      id: uuidv4(),
      title: 'PhoneValidationTooManyAttempts',
      navigationTarget: { screen: 'PhoneValidationTooManyAttempts' },
    },
    {
      id: uuidv4(),
      title: 'PhoneValidationTooManySMSSent',
      navigationTarget: { screen: 'PhoneValidationTooManySMSSent' },
    },
    { id: uuidv4(), title: 'SelectIDOrigin', navigationTarget: { screen: 'SelectIDOrigin' } },
    { id: uuidv4(), title: 'SelectIDStatus', navigationTarget: { screen: 'SelectIDStatus' } },
    { id: uuidv4(), title: 'SelectPhoneStatus', navigationTarget: { screen: 'SelectPhoneStatus' } },
    {
      id: uuidv4(),
      title: 'ProfileInformationValidation',
      navigationTarget: { screen: 'ProfileInformationValidation' },
    },
    {
      id: uuidv4(),
      title: 'Set Address',
      navigationTarget: { screen: 'SetAddress', params: { type: ProfileTypes.IDENTITY_CHECK } },
    },
    {
      id: uuidv4(),
      title: 'Set City',
      navigationTarget: { screen: 'SetCity', params: { type: ProfileTypes.IDENTITY_CHECK } },
    },
    {
      id: uuidv4(),
      title: 'Set Name',
      navigationTarget: { screen: 'SetName', params: { type: ProfileTypes.IDENTITY_CHECK } },
    },
    { id: uuidv4(), title: 'SetPhoneNumber', navigationTarget: { screen: 'SetPhoneNumber' } },
    {
      id: uuidv4(),
      title: 'SetPhoneNumberWithoutValidation',
      navigationTarget: { screen: 'SetPhoneNumberWithoutValidation' },
    },
    {
      id: uuidv4(),
      title: 'SetPhoneValidationCode',
      navigationTarget: { screen: 'SetPhoneValidationCode' },
    },
    {
      id: uuidv4(),
      title: 'Set Status',
      navigationTarget: { screen: 'SetStatus', params: { type: ProfileTypes.IDENTITY_CHECK } },
    },
    { id: uuidv4(), title: 'Stepper', navigationTarget: { screen: 'Stepper' } },
    { id: uuidv4(), title: 'VerifyEligibility', navigationTarget: { screen: 'VerifyEligibility' } },
    {
      id: uuidv4(),
      title: 'NewIdentificationFlow 🎨',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesNavigationNewIdentificationFlow' },
      },
    },
    {
      id: uuidv4(),
      title: 'SetProfileBookingError with offer',
      navigationTarget: { screen: 'SetProfileBookingError', params: { offerId: 1 } },
    },
    {
      id: uuidv4(),
      title: 'SetProfileBookingError without offer',
      navigationTarget: { screen: 'SetProfileBookingError', params: { offerId: undefined } },
    },
    {
      id: uuidv4(),
      title: 'EduConnectValidation',
      navigationTarget: {
        screen: 'EduConnectValidation',
        params: { firstName: 'firstName', lastName: 'lastName', dateOfBirth: '2021-12-01' },
      },
    },
    // Search-only items
    { id: uuidv4(), title: 'DuplicateUser Error', showOnlyInSearch: true },
    { id: uuidv4(), title: 'Generic Error', showOnlyInSearch: true },
    { id: uuidv4(), title: 'PhoneValidationTipsModal', showOnlyInSearch: true },
    { id: uuidv4(), title: 'UserAgeNotValid Educonnect Error', showOnlyInSearch: true },
    { id: uuidv4(), title: 'UserAgeNotValid18YearsOld Error', showOnlyInSearch: true },
    { id: uuidv4(), title: 'UserTypeNotStudent Error', showOnlyInSearch: true },
  ],
}

export const cheatcodesNavigationIdentityCheckButtons: CheatcodeCategory[] = [
  identityCheckCheatcodeCategory,
]

export function CheatcodesNavigationIdentityCheck(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))
  const [screenError, setScreenError] = useState<ScreenError | undefined>(undefined)
  const [phoneValidationTipsModalVisible, setPhoneValidationTipsModalVisible] = useState(false)
  const { navigate } = useNavigation<UseNavigationType>()
  const { logType } = useLogTypeFromRemoteConfig()

  const trigger = (message: EduConnectErrorMessageEnum) => {
    setScreenError(new ScreenError(message, { Screen: NotEligibleEduConnect, logType }))
  }

  if (screenError) throw screenError

  const visibleSubscreens = identityCheckCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={identityCheckCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      {/* --- REFACTORED: Manual links now use the new component API --- */}
      <LinkToCheatcodesScreen
        key="phone-tips-modal"
        button={{
          id: 'phone-tips-action',
          title: 'PhoneValidation tips Modal',
          onPress: () => setPhoneValidationTipsModalVisible(true),
        }}
        variant="secondary"
      />
      <PhoneValidationTipsModal
        isVisible={phoneValidationTipsModalVisible}
        dismissModal={() => setPhoneValidationTipsModalVisible(false)}
        onGoBack={() =>
          navigate('CheatcodesStackNavigator', { screen: 'CheatcodesNavigationIdentityCheck' })
        }
      />

      <LinkToCheatcodesScreen
        key="age-not-valid-error"
        button={{
          id: 'age-not-valid-action',
          title: 'UserAgeNotValid Educonnect Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.UserAgeNotValid),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        key="age-not-valid-18-error"
        button={{
          id: 'age-not-valid-18-action',
          title: 'UserAgeNotValid18YearsOld Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        key="not-student-error"
        button={{
          id: 'not-student-action',
          title: 'UserTypeNotStudent Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.UserTypeNotStudent),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        key="duplicate-user-error"
        button={{
          id: 'duplicate-user-action',
          title: 'DuplicateUser Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.DuplicateUser),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        key="generic-error"
        button={{
          id: 'generic-error-action',
          title: 'Generic Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.GenericError),
        }}
        variant="secondary"
      />
    </CheatcodesTemplateScreen>
  )
}
