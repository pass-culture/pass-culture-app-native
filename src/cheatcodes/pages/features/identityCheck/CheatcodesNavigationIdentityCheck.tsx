import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { NotEligibleEduConnect } from 'features/identityCheck/pages/identification/errors/eduConnect/NotEligibleEduConnect'
import { EduConnectErrorMessageEnum } from 'features/identityCheck/pages/identification/errors/hooks/useNotEligibleEduConnectErrorData'
import { PhoneValidationTipsModal } from 'features/identityCheck/pages/phoneValidation/PhoneValidationTipsModal'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useLogTypeFromRemoteConfig } from 'libs/hooks/useLogTypeFromRemoteConfig'
import { ScreenError } from 'libs/monitoring/errors'

const identityCheckCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'IdentityCheck 🎨',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationIdentityCheck' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'BeneficiaryRequestSent',
      navigationTarget: getSubscriptionPropConfig('BeneficiaryRequestSent'),
    },
    {
      id: uuidv4(),
      title: 'NotEligibleEduConnect',
      navigationTarget: {
        screen: 'CheatcodesStackNavigator',
        params: { screen: 'CheatcodesScreenNotEligibleEduConnect' },
      },
    },
    {
      id: uuidv4(),
      title: 'ComeBackLater',
      navigationTarget: getSubscriptionPropConfig('ComeBackLater'),
    },
    {
      id: uuidv4(),
      title: 'DisableActivation',
      navigationTarget: getSubscriptionPropConfig('DisableActivation'),
    },
    {
      id: uuidv4(),
      title: 'DMSIntroduction',
      navigationTarget: getSubscriptionPropConfig('DMSIntroduction'),
    },
    {
      id: uuidv4(),
      title: 'EduConnectForm',
      navigationTarget: getSubscriptionPropConfig('EduConnectForm'),
    },
    {
      id: uuidv4(),
      title: 'ExpiredOrLostID',
      navigationTarget: getSubscriptionPropConfig('ExpiredOrLostID'),
    },
    {
      id: uuidv4(),
      title: 'IdentificationFork',
      navigationTarget: getSubscriptionPropConfig('IdentificationFork'),
    },
    {
      id: uuidv4(),
      title: 'IdentityCheckDMS',
      navigationTarget: getSubscriptionPropConfig('IdentityCheckDMS'),
    },
    {
      id: uuidv4(),
      title: 'IdentityCheckEnd',
      navigationTarget: getSubscriptionPropConfig('IdentityCheckEnd'),
    },
    {
      id: uuidv4(),
      title: 'IdentityCheckHonor',
      navigationTarget: getSubscriptionPropConfig('IdentityCheckHonor'),
    },
    {
      id: uuidv4(),
      title: 'IdentityCheckPending',
      navigationTarget: getSubscriptionPropConfig('IdentityCheckPending'),
    },
    {
      id: uuidv4(),
      title: 'IdentityCheckUnavailable',
      navigationTarget: getSubscriptionPropConfig('IdentityCheckUnavailable'),
    },
    {
      id: uuidv4(),
      title: 'PhoneValidationTooManyAttempts',
      navigationTarget: getSubscriptionPropConfig('PhoneValidationTooManyAttempts'),
    },
    {
      id: uuidv4(),
      title: 'PhoneValidationTooManySMSSent',
      navigationTarget: getSubscriptionPropConfig('PhoneValidationTooManySMSSent'),
    },
    {
      id: uuidv4(),
      title: 'SelectIDOrigin',
      navigationTarget: getSubscriptionPropConfig('SelectIDOrigin'),
    },
    {
      id: uuidv4(),
      title: 'SelectIDStatus',
      navigationTarget: getSubscriptionPropConfig('SelectIDStatus'),
    },
    {
      id: uuidv4(),
      title: 'SelectPhoneStatus',
      navigationTarget: getSubscriptionPropConfig('SelectPhoneStatus'),
    },
    {
      id: uuidv4(),
      title: 'ProfileInformationValidationCreate (identityCheck)',
      navigationTarget: getSubscriptionPropConfig('ProfileInformationValidationCreate', {
        type: ProfileTypes.IDENTITY_CHECK,
      }),
    },
    {
      id: uuidv4(),
      title: 'ProfileInformationValidationCreate (booking)',
      navigationTarget: getSubscriptionPropConfig('ProfileInformationValidationCreate', {
        type: ProfileTypes.BOOKING_FREE_OFFER_15_16,
      }),
    },
    {
      id: uuidv4(),
      title: 'ProfileInformationValidationCreate (recapExistingData)',
      navigationTarget: getSubscriptionPropConfig('ProfileInformationValidationCreate', {
        type: ProfileTypes.RECAP_EXISTING_DATA,
      }),
    },
    {
      id: uuidv4(),
      title: 'Set Address',
      navigationTarget: getSubscriptionPropConfig('SetAddress', {
        type: ProfileTypes.IDENTITY_CHECK,
      }),
    },
    {
      id: uuidv4(),
      title: 'Set City',
      navigationTarget: getSubscriptionPropConfig('SetCity', { type: ProfileTypes.IDENTITY_CHECK }),
    },
    {
      id: uuidv4(),
      title: 'Set Name',
      navigationTarget: getSubscriptionPropConfig('SetName', { type: ProfileTypes.IDENTITY_CHECK }),
    },
    {
      id: uuidv4(),
      title: 'SetPhoneNumber',
      navigationTarget: getSubscriptionPropConfig('SetPhoneNumber'),
    },
    {
      id: uuidv4(),
      title: 'SetPhoneNumberWithoutValidation',
      navigationTarget: getSubscriptionPropConfig('SetPhoneNumberWithoutValidation'),
    },
    {
      id: uuidv4(),
      title: 'SetPhoneValidationCode',
      navigationTarget: getSubscriptionPropConfig('SetPhoneValidationCode'),
    },
    {
      id: uuidv4(),
      title: 'Set Status',
      navigationTarget: getSubscriptionPropConfig('SetStatus', {
        type: ProfileTypes.IDENTITY_CHECK,
      }),
    },
    { id: uuidv4(), title: 'Stepper', navigationTarget: getSubscriptionPropConfig('Stepper') },
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
      navigationTarget: getSubscriptionPropConfig('SetProfileBookingError', { offerId: 1 }),
    },
    {
      id: uuidv4(),
      title: 'SetProfileBookingError without offer',
      navigationTarget: getSubscriptionPropConfig('SetProfileBookingError', { offerId: undefined }),
    },
    {
      id: uuidv4(),
      title: 'EduConnectValidation',
      navigationTarget: getSubscriptionPropConfig('EduConnectValidation', {
        firstName: 'firstName',
        lastName: 'lastName',
        dateOfBirth: '2021-12-01',
      }),
    },
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
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
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

      <LinkToCheatcodesScreen
        key="phone-tips-modal"
        button={{
          id: uuidv4(),
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
          id: uuidv4(),
          title: 'UserAgeNotValid Educonnect Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.UserAgeNotValid),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        key="age-not-valid-18-error"
        button={{
          id: uuidv4(),
          title: 'UserAgeNotValid18YearsOld Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.UserAgeNotValid18YearsOld),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        key="not-student-error"
        button={{
          id: uuidv4(),
          title: 'UserTypeNotStudent Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.UserTypeNotStudent),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        key="duplicate-user-error"
        button={{
          id: uuidv4(),
          title: 'DuplicateUser Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.DuplicateUser),
        }}
        variant="secondary"
      />

      <LinkToCheatcodesScreen
        key="generic-error"
        button={{
          id: uuidv4(),
          title: 'Generic Error',
          onPress: () => trigger(EduConnectErrorMessageEnum.GenericError),
        }}
        variant="secondary"
      />
    </CheatcodesTemplateScreen>
  )
}
