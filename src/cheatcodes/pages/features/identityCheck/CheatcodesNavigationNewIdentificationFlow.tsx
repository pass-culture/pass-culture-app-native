// cheatcodes/pages/features/identityCheck/CheatcodesNavigationNewIdentificationFlow.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
// --- Import our new types ---
import { CheatcodeButton } from 'cheatcodes/types'
// --- Import the custom navigation hooks ---
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'

export function CheatcodesNavigationNewIdentificationFlow(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  // By defining the links as a data array, the component becomes more declarative.
  const navigationButtons: CheatcodeButton[] = [
    {
      id: uuidv4(),
      title: 'SelectIDOrigin', // Using the screen name as the title, as in the original
      navigationTarget: { screen: 'SelectIDOrigin' },
    },
    {
      id: uuidv4(),
      title: 'SelectIDStatus',
      navigationTarget: { screen: 'SelectIDStatus' },
    },
    {
      id: uuidv4(),
      title: 'SelectPhoneStatus',
      navigationTarget: { screen: 'SelectPhoneStatus' },
    },
    {
      id: uuidv4(),
      title: 'DMS français',
      // The navigation logic is now cleanly encapsulated in the navigationTarget
      navigationTarget: { screen: 'DMSIntroduction', params: { isForeignDMSInformation: false } },
    },
    {
      id: uuidv4(),
      title: 'DMS étranger',
      navigationTarget: { screen: 'DMSIntroduction', params: { isForeignDMSInformation: true } },
    },
    {
      id: uuidv4(),
      title: 'ExpiredOrLostID',
      navigationTarget: { screen: 'ExpiredOrLostID' },
    },
    {
      id: uuidv4(),
      title: 'ComeBackLater',
      navigationTarget: { screen: 'ComeBackLater' },
    },
  ]

  return (
    <CheatcodesTemplateScreen title="NewIdentificationFlow 🎨" onGoBack={goBack}>
      {/* We now simply map over our array of buttons */}
      {navigationButtons.map((button) => (
        <LinkToCheatcodesScreen key={button.id} button={button} variant="secondary" />
      ))}
    </CheatcodesTemplateScreen>
  )
}
