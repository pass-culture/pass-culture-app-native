import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
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
      <LinkToScreen screen="Login" />
      <LinkToScreen screen="FeedbackInApp" />
      <LinkToScreen screen="ChangeCity" />
      <LinkToScreen screen="ChangeEmail" />
      <LinkToScreen screen="ChangeStatus" />
      <LinkToScreen screen="ChangeEmailSetPassword" navigationParams={{ token: 'token' }} />
      <LinkToScreen screen="ConsentSettings" />
      <LinkToScreen screen="NotificationsSettings" />
      <LinkToScreen screen="ChangeEmailExpiredLink" />
      <LinkToScreen title="Modal Crédit Expiré" onPress={showExpiredCreditModal} />
      <ExpiredCreditModal visible={expiredCreditModalVisible} hideModal={hideExpiredCreditModal} />
    </CheatcodesTemplateScreen>
  )
}
