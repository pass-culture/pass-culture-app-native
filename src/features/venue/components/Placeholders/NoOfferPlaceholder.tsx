import React from 'react'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { NoOffer } from 'ui/svg/icons/NoOffer'
import { Typo } from 'ui/theme'

export const NoOfferPlaceholder = () => (
  <Container gap={2}>
    <NoOfferIllustration />
    <Text>Il n’y a pas encore d’offre disponible dans ce lieu</Text>
  </Container>
)

const Container = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  marginHorizontal: theme.designSystem.size.spacing.xxl,
}))

const NoOfferIllustration = styled(NoOffer).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.disabled,
}))``

const Text = styled(Typo.Title4)(({ theme }) => ({
  textAlign: 'center',
  marginVertical: theme.designSystem.size.spacing.xl,
}))
