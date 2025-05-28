import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'
import { getSpacing, Typo } from 'ui/theme'

export const NoInformationPlaceholder = () => (
  <Container gap={2}>
    <NoInfoIllustration />
    <Text>Les infos pratiques ne sont pas encore renseignées pour ce lieu</Text>
  </Container>
)

const Container = styled(ViewGap)({
  alignItems: 'center',
  marginHorizontal: getSpacing(8),
})

const NoInfoIllustration = styled(BicolorCircledClock).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
  color2: theme.colors.greyMedium,
}))``

const Text = styled(Typo.Title4)({
  textAlign: 'center',
  marginVertical: getSpacing(6),
})
