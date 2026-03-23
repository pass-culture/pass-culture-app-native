import React from 'react'

import { DebugButton } from 'features/profile/components/Buttons/DebugButton/DebugButton'
import { Version } from 'features/profile/components/Version/Version'
import { env } from 'libs/environment/env'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ButtonContainerFlexStart } from 'ui/designSystem/Button/ButtonContainerFlexStart'
import { useVersion } from 'ui/hooks/useVersion'

export const Footer = () => {
  const version = useVersion()
  const commitHash = env.COMMIT_HASH

  return (
    <ViewGap gap={5}>
      <Separator.Horizontal />
      <Version version={version} commitHash={commitHash} />
      <ButtonContainerFlexStart>
        <DebugButton />
      </ButtonContainerFlexStart>
      <AccessibilityFooter />
    </ViewGap>
  )
}
