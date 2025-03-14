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
      getProfileNavConfig('FeedbackInApp'),
      getProfileNavConfig('ChangeCity'),
      getProfileNavConfig('ChangeEmail'),
      getProfileNavConfig('ChangeStatus'),
      getProfileNavConfig('ConsentSettings'),
      getProfileNavConfig('NotificationsSettings'),
      getProfileNavConfig('SuspendAccountConfirmationWithoutAuthentication'),
      getProfileNavConfig('SuspendAccountConfirmation'),
      { ...getProfileNavConfig('ChangeEmailSetPassword'), navigationParams: { token: 'token' } },
      { screen: 'Login' },
      { screen: 'ChangeEmailExpiredLink' },
      { title: 'ExpiredCreditModal', showOnlyInSearch: true },
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
