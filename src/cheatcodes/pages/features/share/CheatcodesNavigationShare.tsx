// cheatcodes/pages/features/share/CheatcodesNavigationShare.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
// --- Import our new types ---
import { CheatcodeButton } from 'cheatcodes/types'
// --- Import the custom navigation hooks ---
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'

export function CheatcodesNavigationShare(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))
  const { showShareAppModal } = useShareAppContext()

  // Define the list of actions as a declarative array of CheatcodeButtons.
  const actionButtons: CheatcodeButton[] = [
    {
      id: uuidv4(),
      title: 'Share App Modal - Not Eligible',
      onPress: () => showShareAppModal(ShareAppModalType.NOT_ELIGIBLE),
    },
    {
      id: uuidv4(),
      title: 'Share App Modal - Beneficiary',
      onPress: () => showShareAppModal(ShareAppModalType.BENEFICIARY),
    },
    {
      id: uuidv4(),
      title: 'Share App Modal - Booking success',
      onPress: () => showShareAppModal(ShareAppModalType.ON_BOOKING_SUCCESS),
    },
  ]

  return (
    <CheatcodesTemplateScreen title="Share 🔗" onGoBack={goBack}>
      {/* Map over the array to render the buttons consistently. */}
      {actionButtons.map((button) => (
        <LinkToCheatcodesScreen key={button.id} button={button} variant="secondary" />
      ))}
    </CheatcodesTemplateScreen>
  )
}
