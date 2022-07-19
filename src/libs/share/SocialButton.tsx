import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'
import { IconInterface } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  label: string
  icon: FunctionComponent<IconInterface>
  externalNav: TouchableLinkProps['externalNav']
}

export const SocialButton = ({ label, icon: Icon, externalNav }: Props) => (
  <Container externalNav={externalNav}>
    <Icon />
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Caption>{label}</Typo.Caption>
  </Container>
)

const Container = styled(TouchableLink)({
  flexGrow: 1,
  alignItems: 'center',
  minWidth: 100,
})
