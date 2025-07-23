import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeButton } from 'cheatcodes/types'
import { getCheatcodesHookConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesHookConfig'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { useGoBack } from 'features/navigation/useGoBack'

export function CheatcodesNavigationNewIdentificationFlow(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesHookConfig('CheatcodesMenu'))

  const navigationButtons: CheatcodeButton[] = [
    {
      id: uuidv4(),
      title: 'SelectIDOrigin',
      navigationTarget: getSubscriptionPropConfig('SelectIDOrigin'),
    },
    {
      id: uuidv4(),
      title: 'SelectIDStatus',
      navigationTarget: getSubscriptionPropConfig('SelectIDStatus'),
    },
    {
      id: uuidv4(),
      title: 'SelectPhoneStatus',
      navigationTarget: getSubscriptionPropConfig('SelectPhoneStatus'),
    },
    {
      id: uuidv4(),
      title: 'DMS français',
      navigationTarget: getSubscriptionPropConfig('DMSIntroduction', {
        isForeignDMSInformation: false,
      }),
    },
    {
      id: uuidv4(),
      title: 'DMS étranger',
      navigationTarget: getSubscriptionPropConfig('DMSIntroduction', {
        isForeignDMSInformation: true,
      }),
    },
    {
      id: uuidv4(),
      title: 'ExpiredOrLostID',
      navigationTarget: getSubscriptionPropConfig('ExpiredOrLostID'),
    },
    {
      id: uuidv4(),
      title: 'ComeBackLater',
      navigationTarget: getSubscriptionPropConfig('ComeBackLater'),
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
