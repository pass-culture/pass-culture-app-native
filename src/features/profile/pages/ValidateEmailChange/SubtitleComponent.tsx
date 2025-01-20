import React from 'react'
import styled from 'styled-components/native'

import { Separator } from 'ui/components/Separator'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'
import { TextProps } from 'ui/theme/typography'

export function ValidateEmailChangeSubtitleComponent(props: TextProps) {
  return (
    <Wrapper>
      <TypoDS.Body>Nouvelle adresse e-mail&nbsp;:</TypoDS.Body>
      <TypoDS.BodyAccent {...props} />
      <Spacer.Column numberOfSpaces={4} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={4} />
      <StyledCaption>
        En cliquant sur valider, tu seras déconnecté.e. Tu devras te reconnecter avec ta nouvelle
        adresse e-mail.
      </StyledCaption>
    </Wrapper>
  )
}

const Wrapper = styled.View({
  marginTop: getSpacing(4),
  alignItems: 'center',
})

const StyledCaption = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  textAlign: 'center',
  color: theme.colors.greyDark,
}))
