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
      <LinkToComponent screen="Login" />
      <LinkToComponent screen="FeedbackInApp" />
      <LinkToComponent screen="ChangeCity" />
      <LinkToComponent screen="ChangeEmail" />
      <LinkToComponent screen="ChangeStatus" />
      <LinkToComponent screen="ChangeEmailSetPassword" navigationParams={{ token: 'token' }} />
      <LinkToComponent screen="ConsentSettings" />
      <LinkToComponent screen="NotificationsSettings" />
      <LinkToComponent screen="ChangeEmailExpiredLink" />
      <LinkToComponent title="Modal Crédit Expiré" onPress={showExpiredCreditModal} />
      <ExpiredCreditModal visible={expiredCreditModalVisible} hideModal={hideExpiredCreditModal} />
    </CheatcodesTemplateScreen>
  )
}
