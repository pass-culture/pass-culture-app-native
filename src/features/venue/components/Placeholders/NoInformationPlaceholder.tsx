import React from 'react'
import styled from 'styled-components/native'

import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NoInformationPlaceholder = () => (
  <Container>
    <Spacer.Column numberOfSpaces={6} />
    <NoInfoIllustration />
    <Spacer.Column numberOfSpaces={2} />
    <Text>Les infos pratiques ne sont pas encore renseignées pour ce lieu</Text>
    <Spacer.Column numberOfSpaces={6} />
  </Container>
)

const Container = styled.View({
  alignItems: 'center',
  marginHorizontal: getSpacing(8),
})

const NoInfoIllustration = styled(BicolorCircledClock).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
  color2: theme.colors.greyMedium,
}))``

const Text = styled(Typo.Title4)({
  textAlign: 'center',
})
