import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export function CheatcodesNavigationNewIdentificationFlow(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <CheatcodesTemplateScreen title="NewIdentificationFlow 🎨">
      <LinkToCheatcodesScreen screen="SelectIDOrigin" />
      <LinkToCheatcodesScreen screen="SelectIDStatus" />
      <LinkToCheatcodesScreen screen="SelectPhoneStatus" />
      <LinkToCheatcodesScreen
        screen="DMSIntroduction"
        title="DMS français"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: false })}
      />
      <LinkToCheatcodesScreen
        screen="DMSIntroduction"
        title="DMS étranger"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: true })}
      />
      <LinkToCheatcodesScreen screen="ExpiredOrLostID" />
      <LinkToCheatcodesScreen screen="ComeBackLater" />
    </CheatcodesTemplateScreen>
  )
}
