import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { MarketingBlockExclusivity } from 'features/home/components/modules/marketing/MarketingBlockExclusivity'
import { MarketingBlockHighlight } from 'features/home/components/modules/marketing/MarketingBlockHighlight'
import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { Spacer, Typo } from 'ui/theme'

export const MarketingBlocks = () => {
  return (
    <ScrollView>
      <CheatcodesHeader title="Marketing blocks" />
      <Spacer.Column numberOfSpaces={6} />
      <Container>
        <Typo.Title3>MarketingBlockExclusivity</Typo.Title3>
      </Container>
      <Spacer.Column numberOfSpaces={6} />
      <MarketingBlockExclusivity
        categoryId={CategoryIdEnum.FILM}
        offerId={1}
        title="Harry Potter et l’Ordre du Phénix"
        backgroundImageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
        offerImageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
        categoryText="Cinéma"
        offerLocation={{ lat: 1, lng: 1 }}
        price="10€"
      />
      <Spacer.Column numberOfSpaces={12} />
      <Container>
        <Typo.Title3>MarketingBlockHighlight</Typo.Title3>
      </Container>
      <Spacer.Column numberOfSpaces={6} />
      <MarketingBlockHighlight
        categoryId={CategoryIdEnum.FILM}
        title="Marathon Harry Potter dans tous les cinémas de France"
        backgroundImageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
        categoryText="Cinéma"
        date="Du 12/06 au 24/06"
        homeId="homeId"
        moduleId="moduleId"
      />
      <Spacer.Column numberOfSpaces={12} />
    </ScrollView>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))
