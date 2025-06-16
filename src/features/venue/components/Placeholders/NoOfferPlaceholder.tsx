import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { getSpacing, Typo } from 'ui/theme'

export const NoOfferPlaceholder = () => (
  <Container gap={2}>
    <NoOfferIllustration />
    <Text>Il n’y a pas encore d’offre disponible dans ce lieu</Text>
  </Container>
)

const Container = styled(ViewGap)({
  alignItems: 'center',
  marginHorizontal: getSpacing(8),
})

const NoOfferIllustration = styled(NoOffer).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.disabled,
}))``

const Text = styled(Typo.Title4)({
  textAlign: 'center',
  marginVertical: getSpacing(6),
})
