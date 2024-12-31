import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export function CheatcodesNavigationNewIdentificationFlow(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <CheatcodesTemplateScreen title="NewIdentificationFlow 🎨">
      <LinkToComponent screen="SelectIDOrigin" />
      <LinkToComponent screen="SelectIDStatus" />
      <LinkToComponent screen="SelectPhoneStatus" />
      <LinkToComponent
        screen="DMSIntroduction"
        title="DMS français"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: false })}
      />
      <LinkToComponent
        screen="DMSIntroduction"
        title="DMS étranger"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: true })}
      />
      <LinkToComponent screen="ExpiredOrLostID" />
      <LinkToComponent screen="ComeBackLater" />
    </CheatcodesTemplateScreen>
  )
}
