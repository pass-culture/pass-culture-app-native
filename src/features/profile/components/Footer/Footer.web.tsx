import React from 'react'

import { DebugButton } from 'features/profile/components/Buttons/DebugButton/DebugButton'
import { Version } from 'features/profile/components/Version/Version'
import { env } from 'libs/environment/env'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useVersion } from 'ui/hooks/useVersion'

export const Footer = () => {
  const version = useVersion()
  const commitHash = env.COMMIT_HASH

  return (
    <ViewGap gap={5}>
      <Separator.Horizontal />
      <Version version={version} commitHash={commitHash} />
      <DebugButton />
      <AccessibilityFooter />
    </ViewGap>
  )
}
