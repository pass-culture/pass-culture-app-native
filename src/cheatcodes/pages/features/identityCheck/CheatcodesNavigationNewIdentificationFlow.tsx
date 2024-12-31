import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export function CheatcodesNavigationNewIdentificationFlow(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <CheatcodesTemplateScreen title="NewIdentificationFlow 🎨">
      <LinkToComponent name="SelectIDOrigin" />
      <LinkToComponent name="SelectIDStatus" />
      <LinkToComponent name="SelectPhoneStatus" />
      <LinkToComponent
        name="DMSIntroduction"
        title="DMS français"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: false })}
      />
      <LinkToComponent
        name="DMSIntroduction"
        title="DMS étranger"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: true })}
      />
      <LinkToComponent name="ExpiredOrLostID" />
      <LinkToComponent name="ComeBackLater" />
    </CheatcodesTemplateScreen>
  )
}
