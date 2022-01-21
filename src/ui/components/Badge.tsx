import React from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'
export const Badge: React.FunctionComponent<IconInterface & { label: string | number }> = ({
  label,
  testID,
}) => (
  <Container testID={testID}>
    <Typo.Caption color={ColorsEnum.WHITE}>{label}</Typo.Caption>
  </Container>
)

const Container = styled.View({
  background: ColorsEnum.PRIMARY,
  height: getSpacing(4),
  borderRadius: getSpacing(2),
  paddingHorizontal: getSpacing(2),
})
