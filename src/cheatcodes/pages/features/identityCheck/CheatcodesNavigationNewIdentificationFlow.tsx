import { useNavigation } from '@react-navigation/native'
import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'

export function CheatcodesNavigationNewIdentificationFlow(): React.JSX.Element {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <CheatcodesTemplateScreen title="NewIdentificationFlow 🎨">
      <LinkToComponent
        name="SelectIDOrigin"
        title="SelectIDOrigin"
        onPress={() => navigate('SelectIDOrigin')}
      />
      <LinkToComponent
        name="SelectIDStatus"
        title="SelectIDStatus"
        onPress={() => navigate('SelectIDStatus')}
      />
      <LinkToComponent
        name="SelectPhoneStatus"
        title="SelectPhoneStatus"
        onPress={() => navigate('SelectPhoneStatus')}
      />
      <LinkToComponent
        name="DMSIntroduction"
        title="DMS FR"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: false })}
      />
      <LinkToComponent
        name="DMSIntroduction"
        title="DMS ETR"
        onPress={() => navigate('DMSIntroduction', { isForeignDMSInformation: true })}
      />
      <LinkToComponent
        name="ExpiredOrLostID"
        title="ExpiredOrLostID"
        onPress={() => navigate('ExpiredOrLostID')}
      />
      <LinkToComponent name="ComeBackLater" title="Reviens plus tard" />
    </CheatcodesTemplateScreen>
  )
}
