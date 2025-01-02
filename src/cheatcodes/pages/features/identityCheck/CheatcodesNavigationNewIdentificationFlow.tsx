import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export function CheatcodesNavigationNewIdentificationFlow(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <CheatcodesTemplateScreen title="NewIdentificationFlow 🎨">
      <LinkToScreen screen="SelectIDOrigin" />
      <LinkToScreen screen="SelectIDStatus" />
      <LinkToScreen screen="SelectPhoneStatus" />
      <LinkToScreen
        screen="DMSIntroduction"
        title="DMS français"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: false })}
      />
      <LinkToScreen
        screen="DMSIntroduction"
        title="DMS étranger"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: true })}
      />
      <LinkToScreen screen="ExpiredOrLostID" />
      <LinkToScreen screen="ComeBackLater" />
    </CheatcodesTemplateScreen>
  )
}
