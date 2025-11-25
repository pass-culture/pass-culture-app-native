import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/navigators/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { useModal } from 'ui/components/modals/useModal'

const profileCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Profile 🎨',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationProfile' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'ChangeEmailExpiredLink',
      navigationTarget: { screen: 'ChangeEmailExpiredLink' },
    },
    { id: uuidv4(), title: 'Login', navigationTarget: { screen: 'Login' } },
    {
      id: uuidv4(),
      title: 'ChangeCity',
      navigationTarget: getProfilePropConfig('ChangeCity'),
    },
    {
      id: uuidv4(),
      title: 'ChangeAddress',
      navigationTarget: getProfilePropConfig('ChangeAddress'),
    },
    {
      id: uuidv4(),
      title: 'ChangeEmail',
      navigationTarget: getProfilePropConfig('ChangeEmail'),
    },
    {
      id: uuidv4(),
      title: 'ChangeStatus',
      navigationTarget: getProfilePropConfig('ChangeStatus'),
    },
    {
      id: uuidv4(),
      title: 'ConsentSettings',
      navigationTarget: getProfilePropConfig('ConsentSettings'),
    },
    {
      id: uuidv4(),
      title: 'DeactivateProfileSuccess',
      navigationTarget: getProfilePropConfig('DeactivateProfileSuccess'),
    },
    {
      id: uuidv4(),
      title: 'DeleteProfileReason',
      navigationTarget: getProfilePropConfig('DeleteProfileReason'),
    },
    {
      id: uuidv4(),
      title: 'DeleteProfileContactSupport',
      navigationTarget: getProfilePropConfig('DeleteProfileContactSupport'),
    },
    {
      id: uuidv4(),
      title: 'FeedbackInApp',
      navigationTarget: getProfilePropConfig('FeedbackInApp'),
    },
    {
      id: uuidv4(),
      title: 'NotificationsSettings',
      navigationTarget: getProfilePropConfig('NotificationsSettings'),
    },
    {
      id: uuidv4(),
      title: 'SuspendAccountConfirmation',
      navigationTarget: getProfilePropConfig('SuspendAccountConfirmation'),
    },
    {
      id: uuidv4(),
      title: 'ProfileTutorialAgeInformationCredit',
      navigationTarget: getProfilePropConfig('ProfileTutorialAgeInformationCredit'),
    },
    {
      id: uuidv4(),
      title: 'SuspendAccountConfirmationWithoutAuthentication',
      navigationTarget: getProfilePropConfig('SuspendAccountConfirmationWithoutAuthentication'),
    },
    {
      id: uuidv4(),
      title: 'ChangeEmailSetPassword',
      navigationTarget: getProfilePropConfig('ChangeEmailSetPassword', {
        token: 'token',
        emailSelectionToken: 'token',
      }),
    },
    {
      id: uuidv4(),
      title: 'ExpiredCreditModal',
      showOnlyInSearch: true,
    },
    {
      id: uuidv4(),
      title: 'MandatoryUpdatePersonalData',
      navigationTarget: getProfilePropConfig('MandatoryUpdatePersonalData'),
    },
    {
      id: uuidv4(),
      title: 'UpdatePersonalDataConfirmation',
      navigationTarget: getProfilePropConfig('UpdatePersonalDataConfirmation'),
    },
    {
      id: uuidv4(),
      title: 'ProfileInformationValidationUpdate',
      navigationTarget: getProfilePropConfig('ProfileInformationValidationUpdate'),
    },
    {
      id: uuidv4(),
      title: 'TrackEmailChange',
      navigationTarget: getProfilePropConfig('TrackEmailChange'),
    },
  ],
}

export const cheatcodesNavigationProfileButtons: CheatcodeCategory[] = [profileCheatcodeCategory]

export function CheatcodesNavigationProfile(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))
  const {
    visible: expiredCreditModalVisible,
    showModal: showExpiredCreditModal,
    hideModal: hideExpiredCreditModal,
  } = useModal(false)

  const visibleSubscreens = profileCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={profileCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      <LinkToCheatcodesScreen
        key="expired-credit-modal"
        button={{
          id: 'expired-credit-action',
          title: 'ExpiredCreditModal',
          onPress: showExpiredCreditModal,
        }}
        variant="secondary"
      />
      <ExpiredCreditModal visible={expiredCreditModalVisible} hideModal={hideExpiredCreditModal} />
    </CheatcodesTemplateScreen>
  )
}
