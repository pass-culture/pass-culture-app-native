import React from 'react'
import styled from 'styled-components/native'

import { DebugButton } from 'features/profile/components/Buttons/DebugButton/DebugButton'
import { Version } from 'features/profile/components/Version/Version'
import { env } from 'libs/environment/env'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useVersion } from 'ui/hooks/useVersion'
import { LogoFrenchRepublic } from 'ui/svg/LogoFrenchRepublic'
import { getSpacing } from 'ui/theme/spacing'

export const Footer = () => {
  const version = useVersion()
  const commitHash = env.COMMIT_HASH

  return (
    <Container gap={5}>
      <Separator.Horizontal />
      <Version version={version} commitHash={commitHash} />
      <DebugButton />
      <LogoFrenchRepublicContainer>
        <LogoFrenchRepublic />
      </LogoFrenchRepublicContainer>
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.tabBar.heightV2,
}))

const LogoFrenchRepublicContainer = styled.View({
  width: getSpacing(40),
  height: getSpacing(28),
})
