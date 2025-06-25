import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
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
      navigationTarget: getProfileNavConfig('ChangeCity'),
    },
    {
      id: uuidv4(),
      title: 'ChangeEmail',
      navigationTarget: getProfileNavConfig('ChangeEmail'),
    },
    {
      id: uuidv4(),
      title: 'ChangeStatus',
      navigationTarget: getProfileNavConfig('ChangeStatus'),
    },
    {
      id: uuidv4(),
      title: 'ConsentSettings',
      navigationTarget: getProfileNavConfig('ConsentSettings'),
    },
    {
      id: uuidv4(),
      title: 'DeactivateProfileSuccess',
      navigationTarget: getProfileNavConfig('DeactivateProfileSuccess'),
    },
    {
      id: uuidv4(),
      title: 'DeleteProfileReason',
      navigationTarget: getProfileNavConfig('DeleteProfileReason'),
    },
    {
      id: uuidv4(),
      title: 'FeedbackInApp',
      navigationTarget: getProfileNavConfig('FeedbackInApp'),
    },
    {
      id: uuidv4(),
      title: 'NotificationsSettings',
      navigationTarget: getProfileNavConfig('NotificationsSettings'),
    },
    {
      id: uuidv4(),
      title: 'SuspendAccountConfirmation',
      navigationTarget: getProfileNavConfig('SuspendAccountConfirmation'),
    },
    {
      id: uuidv4(),
      title: 'ProfileTutorialAgeInformationCredit',
      navigationTarget: getProfileNavConfig('ProfileTutorialAgeInformationCredit'),
    },
    {
      id: uuidv4(),
      title: 'SuspendAccountConfirmationWithoutAuthentication',
      navigationTarget: getProfileNavConfig('SuspendAccountConfirmationWithoutAuthentication'),
    },
    {
      id: uuidv4(),
      title: 'ChangeEmailSetPassword',
      navigationTarget: getProfileNavConfig('ChangeEmailSetPassword', {
        token: 'token',
        emailSelectionToken: 'token',
      }),
    },
    { id: uuidv4(), title: 'ExpiredCreditModal', showOnlyInSearch: true },
  ],
}

export const cheatcodesNavigationProfileButtons: CheatcodeCategory[] = [profileCheatcodeCategory]

export function CheatcodesNavigationProfile(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))
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
