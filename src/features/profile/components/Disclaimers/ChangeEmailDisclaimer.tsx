import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'

export function ChangeEmailDisclaimer() {
  return (
    <ViewGap gap={4}>
      <CaptionNeutralInfo>
        Pour modifier ton adresse e-mail, tu dois d’abord faire une demande de modification.
      </CaptionNeutralInfo>
      <CaptionNeutralInfo>
        Tu ne peux modifier ton adresse e-mail qu’une fois par jour.
      </CaptionNeutralInfo>
      <Separator.Horizontal />
    </ViewGap>
  )
}

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
