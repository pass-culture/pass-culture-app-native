import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalNavigationProps } from 'ui/components/touchableLink/types'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo, getSpacing } from 'ui/theme'

interface Props {
  label: string
  icon: FunctionComponent<AccessibleIcon>
  externalNav: ExternalNavigationProps['externalNav']
}

export const SocialButton = ({ label, icon: Icon, externalNav }: Props) => (
  <Container externalNav={externalNav}>
    <Icon />
    <Label>{label}</Label>
  </Container>
)

const Container = styled(ExternalTouchableLink)({
  flexGrow: 1,
  alignItems: 'center',
  minWidth: 100,
})

const Label = styled(Typo.BodyAccentXs)({
  marginTop: getSpacing(2),
})
