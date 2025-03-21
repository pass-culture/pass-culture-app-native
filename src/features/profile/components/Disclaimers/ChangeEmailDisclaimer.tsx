import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'

export function ChangeEmailDisclaimer() {
  return (
    <React.Fragment>
      <CaptionNeutralInfo>
        Pour modifier ton adresse e-mail, tu dois d’abord faire une demande de modification.
      </CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={4} />
      <CaptionNeutralInfo>
        Tu ne peux modifier ton adresse e-mail qu’une fois par jour.
      </CaptionNeutralInfo>
      <Spacer.Column numberOfSpaces={4} />
      <Separator.Horizontal />
    </React.Fragment>
  )
}

const CaptionNeutralInfo = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
