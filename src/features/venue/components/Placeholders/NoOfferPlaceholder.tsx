import React from 'react'
import styled from 'styled-components/native'

import { NoOffer } from 'ui/svg/icons/NoOffer'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const NoOfferPlaceholder = () => (
  <Container>
    <Spacer.Column numberOfSpaces={6} />
    <NoOfferIllustration />
    <Spacer.Column numberOfSpaces={2} />
    <Text>Il n’y a pas encore d’offre disponible dans ce lieu</Text>
    <Spacer.Column numberOfSpaces={6} />
  </Container>
)

const Container = styled.View({
  alignItems: 'center',
  marginHorizontal: getSpacing(8),
})

const NoOfferIllustration = styled(NoOffer).attrs(({ theme }) => ({
  color: theme.colors.greyMedium,
}))``

const Text = styled(Typo.Title4)({
  textAlign: 'center',
})
