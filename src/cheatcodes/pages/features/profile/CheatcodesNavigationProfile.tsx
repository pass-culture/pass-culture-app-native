import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { ExpiredCreditModal } from 'features/profile/components/Modals/ExpiredCreditModal'
import { useModal } from 'ui/components/modals/useModal'

export function CheatcodesNavigationProfile(): React.JSX.Element {
  const {
    visible: expiredCreditModalVisible,
    showModal: showExpiredCreditModal,
    hideModal: hideExpiredCreditModal,
  } = useModal(false)

  return (
    <CheatcodesTemplateScreen title="Profile 🎨">
      <LinkToComponent name="Login" />
      <LinkToComponent name="FeedbackInApp" />
      <LinkToComponent name="ChangeCity" />
      <LinkToComponent name="ChangeEmail" />
      <LinkToComponent name="ChangeStatus" />
      <LinkToComponent name="ChangeEmailSetPassword" navigationParams={{ token: 'token' }} />
      <LinkToComponent name="ConsentSettings" />
      <LinkToComponent name="NotificationsSettings" />
      <LinkToComponent name="ChangeEmailExpiredLink" />
      <LinkToComponent title="Modal Crédit Expiré" onPress={showExpiredCreditModal} />
      <ExpiredCreditModal visible={expiredCreditModalVisible} hideModal={hideExpiredCreditModal} />
    </CheatcodesTemplateScreen>
  )
}
