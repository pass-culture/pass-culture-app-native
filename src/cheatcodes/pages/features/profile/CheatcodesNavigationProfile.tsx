import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { useModal } from 'ui/components/modals/useModal'

export const cheatcodesNavigationProfileButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Profile 🎨',
    screen: 'CheatcodesNavigationProfile',
    subscreens: [
      { screen: 'Login' },
      { screen: 'FeedbackInApp' },
      { screen: 'ChangeCity' },
      { screen: 'ChangeEmail' },
      { screen: 'ChangeStatus' },
      { screen: 'ChangeEmailSetPassword', navigationParams: { token: 'token' } },
      { screen: 'ConsentSettings' },
      { screen: 'NotificationsSettings' },
      { screen: 'ChangeEmailExpiredLink' },
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

      <LinkToScreen title="Modal Crédit Expiré" onPress={showExpiredCreditModal} />
      <ExpiredCreditModal visible={expiredCreditModalVisible} hideModal={hideExpiredCreditModal} />
    </CheatcodesTemplateScreen>
  )
}
