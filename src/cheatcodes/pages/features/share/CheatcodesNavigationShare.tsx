import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'

export function CheatcodesNavigationShare(): React.JSX.Element {
  const { showShareAppModal } = useShareAppContext()

  return (
    <CheatcodesTemplateScreen title="Share 🔗">
      <LinkToScreen
        title="Share App Modal - Not Eligible"
        onPress={() => showShareAppModal(ShareAppModalType.NOT_ELIGIBLE)}
      />
      <LinkToScreen
        title="Share App Modal - Beneficiary"
        onPress={() => showShareAppModal(ShareAppModalType.BENEFICIARY)}
      />
      <LinkToScreen
        title="Share App Modal - Booking success"
        onPress={() => showShareAppModal(ShareAppModalType.ON_BOOKING_SUCCESS)}
      />
    </CheatcodesTemplateScreen>
  )
}
