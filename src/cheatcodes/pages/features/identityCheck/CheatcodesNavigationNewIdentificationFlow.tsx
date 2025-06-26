import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeButton } from 'cheatcodes/types'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'

export function CheatcodesNavigationNewIdentificationFlow(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))

  const navigationButtons: CheatcodeButton[] = [
    {
      id: uuidv4(),
      title: 'SelectIDOrigin',
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
      {navigationButtons.map((button) => (
        <LinkToCheatcodesScreen key={button.id} button={button} variant="secondary" />
      ))}
    </CheatcodesTemplateScreen>
  )
}
