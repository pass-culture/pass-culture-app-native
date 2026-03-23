import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme/typography'

const isWeb = Platform.OS === 'web'

type Props = { version: string; commitHash?: string }

export const Version: React.FC<Props> = ({ version, commitHash }) => {
  const formattedCommitHash = commitHash ? `-${commitHash}` : ''
  const commitHashSuffix = isWeb ? formattedCommitHash : ''
  return (
    <StyledBodyAccentXs>
      {version}
      {commitHashSuffix}
    </StyledBodyAccentXs>
  )
}

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
