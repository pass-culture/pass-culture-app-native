import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { FormattedLastLoginInfo } from 'features/auth/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { Typo } from 'ui/theme'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

type Props = { lastLoginInfo: FormattedLastLoginInfo | null }

export const LastLoginInfoBanner: FunctionComponent<Props> = ({ lastLoginInfo }) => {
  if (!lastLoginInfo) return null

  return (
    <Container gap={4}>
      <Tag label={lastLoginInfo.provider.label} Icon={lastLoginInfo.provider.icon} />
      <Typo.Title4 {...setTextSemantic('p')}>{lastLoginInfo.maskedEmail}</Typo.Title4>
      <Typo.BodyXs>Connecté pour la dernière fois le {lastLoginInfo.lastLoginAt}</Typo.BodyXs>
    </Container>
  )
}

const Container = styled(ViewGap)(({ theme }) => ({
  padding: theme.designSystem.size.spacing.l,
  border: `1px solid ${theme.designSystem.color.border.subtle}`,
  borderRadius: theme.designSystem.size.borderRadius.m,
}))
