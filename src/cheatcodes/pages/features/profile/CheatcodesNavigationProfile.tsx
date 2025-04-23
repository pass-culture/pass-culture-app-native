import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { useModal } from 'ui/components/modals/useModal'

export const cheatcodesNavigationProfileButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Profile 🎨',
    screen: 'CheatcodesNavigationProfile',
    subscreens: [
      { screen: 'ChangeEmailExpiredLink' },
      { screen: 'Login' },
      { title: 'ExpiredCreditModal', showOnlyInSearch: true },
      getProfileNavConfig('ChangeCity'),
      getProfileNavConfig('ChangeEmail'),
      getProfileNavConfig('ChangeStatus'),
      getProfileNavConfig('ConsentSettings'),
      getProfileNavConfig('DeactivateProfileSuccess'),
      getProfileNavConfig('DeleteProfileReason'),
      getProfileNavConfig('FeedbackInApp'),
      getProfileNavConfig('NotificationsSettings'),
      getProfileNavConfig('SuspendAccountConfirmation'),
      getProfileNavConfig('ProfileTutorialAgeInformationCredit'),
      getProfileNavConfig('SuspendAccountConfirmationWithoutAuthentication'),
      { ...getProfileNavConfig('ChangeEmailSetPassword'), navigationParams: { token: 'token' } },
    ],
  },
]

export function CheatcodesNavigationProfile(): React.JSX.Element {
  const {
    visible: expiredCreditModalVisible,
    showModal: showExpiredCreditModal,
    hideModal: hideExpiredCreditModal,
  } = useModal(false)

  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationProfileButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationProfileButtons} />

      <LinkToScreen title="ExpiredCreditModal" onPress={showExpiredCreditModal} />
      <ExpiredCreditModal visible={expiredCreditModalVisible} hideModal={hideExpiredCreditModal} />
    </CheatcodesTemplateScreen>
  )
}
