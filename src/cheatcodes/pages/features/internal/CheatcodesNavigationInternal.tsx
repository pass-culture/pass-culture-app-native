import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'

export function CheatcodesNavigationInternal(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Internal (Maketing) 🎯">
      <LinkToComponent name="DeeplinksGenerator" />
      <LinkToComponent name="UTMParameters" />
    </CheatcodesTemplateScreen>
  )
}
