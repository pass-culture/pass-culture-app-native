import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  label: string
  icon: FunctionComponent<IconInterface>
  onPress: () => void
}

export const SocialButton = ({ label, icon: Icon, onPress }: Props) => (
  <Container onPress={onPress}>
    <Icon />
    <Spacer.Column numberOfSpaces={2} />
    <Typo.Caption>{label}</Typo.Caption>
  </Container>
)

const Container = styled.TouchableOpacity({
  flexGrow: 1,
  alignItems: 'center',
  minWidth: 100,
})
