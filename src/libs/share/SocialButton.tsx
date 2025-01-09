import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalNavigationProps } from 'ui/components/touchableLink/types'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, TypoDS } from 'ui/theme'

interface Props {
  label: string
  icon: FunctionComponent<AccessibleIcon>
  externalNav: ExternalNavigationProps['externalNav']
}

export const SocialButton = ({ label, icon: Icon, externalNav }: Props) => (
  <Container externalNav={externalNav}>
    <Icon />
    <Spacer.Column numberOfSpaces={2} />
    <TypoDS.BodyAccentXs>{label}</TypoDS.BodyAccentXs>
  </Container>
)

const Container = styled(ExternalTouchableLink)({
  flexGrow: 1,
  alignItems: 'center',
  minWidth: 100,
})
