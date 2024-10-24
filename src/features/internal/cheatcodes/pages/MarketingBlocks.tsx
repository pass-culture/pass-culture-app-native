import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { MarketingBlockExclusivity } from 'features/home/components/modules/marketing/MarketingBlockExclusivity'
import { MarketingBlockHighlight } from 'features/home/components/modules/marketing/MarketingBlockHighlight'
import { CheatcodesHeader } from 'features/internal/cheatcodes/components/CheatcodesHeader'
import { offersFixture } from 'shared/offer/offer.fixture'
import { Spacer, TypoDS } from 'ui/theme'

export const MarketingBlocks = () => {
  return (
    <ScrollView>
      <CheatcodesHeader title="Marketing blocks" />
      <Spacer.Column numberOfSpaces={6} />
      <Container>
        <TypoDS.Title3>MarketingBlockExclusivity</TypoDS.Title3>
      </Container>
      <Spacer.Column numberOfSpaces={6} />
      <MarketingBlockExclusivity
        moduleId="1"
        offer={offersFixture[0]}
        backgroundImageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
      />
      <Spacer.Column numberOfSpaces={12} />
      <Container>
        <TypoDS.Title3>MarketingBlockHighlight</TypoDS.Title3>
      </Container>
      <Spacer.Column numberOfSpaces={6} />
      <MarketingBlockHighlight
        title="Marathon Harry Potter dans tous les cinémas de France"
        backgroundImageUrl="https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW"
        subtitle="Du 12/06 au 24/06"
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
