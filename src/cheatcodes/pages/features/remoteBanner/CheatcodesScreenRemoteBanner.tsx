import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { RemoteBanner } from 'features/remoteBanner/components/RemoteBanner'
import { Spacer } from 'ui/theme'

export const CheatcodesScreenRemoteBanner = () => {
  return (
    <CheatcodesTemplateScreen title="RemoteBanner 🆒" flexDirection="column">
      <Spacer.Column numberOfSpaces={3} />
      <RemoteBanner />
    </CheatcodesTemplateScreen>
  )
}
