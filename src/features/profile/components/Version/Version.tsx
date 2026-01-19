import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { env } from 'libs/environment/env'
import { useVersion } from 'ui/hooks/useVersion'
import { Typo } from 'ui/theme/typography'

const isWeb = Platform.OS === 'web'

export const Version = () => {
  const version = useVersion()
  return (
    <StyledBodyAccentXs>
      {version}
      {isWeb ? `-${String(env.COMMIT_HASH)}` : ''}
    </StyledBodyAccentXs>
  )
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
