import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'

export function CheatcodesNavigationInternal(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Internal (Maketing) 🎯">
      <LinkToScreen screen="DeeplinksGenerator" />
      <LinkToScreen screen="UTMParameters" />
    </CheatcodesTemplateScreen>
  )
}
