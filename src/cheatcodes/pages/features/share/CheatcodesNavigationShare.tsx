import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'

export function CheatcodesNavigationShare(): React.JSX.Element {
  const { showShareAppModal } = useShareAppContext()

  return (
    <CheatcodesTemplateScreen title="Share 🔗">
      <LinkToCheatcodesScreen
        title="Share App Modal - Not Eligible"
        onPress={() => showShareAppModal(ShareAppModalType.NOT_ELIGIBLE)}
      />
      <LinkToCheatcodesScreen
        title="Share App Modal - Beneficiary"
        onPress={() => showShareAppModal(ShareAppModalType.BENEFICIARY)}
      />
      <LinkToCheatcodesScreen
        title="Share App Modal - Booking success"
        onPress={() => showShareAppModal(ShareAppModalType.ON_BOOKING_SUCCESS)}
      />
    </CheatcodesTemplateScreen>
  )
}
