import { ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferName } from 'ui/components/tiles/OfferName'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { getSpacing, TypoDS } from 'ui/theme'

import { HorizontalTile } from './HorizontalTile'

const meta: ComponentMeta<typeof HorizontalTile> = {
  title: 'ui/tiles/HorizontalTile',
  component: HorizontalTile,
}
export default meta

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  gap: getSpacing(4),
})

const Body = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const OfferNameContainer = styled.View({
  flexShrink: 1,
})

const Column = styled.View({
  flex: 1,
})

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const variantConfig: Variants<typeof HorizontalTile> = [
  {
    label: 'HorizontalTile - Default',
    props: {
      categoryId: CategoryIdEnum.CINEMA,
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      children: (
        <Container>
          <Column>
            <Row>
              <OfferNameContainer>
                <OfferName title="Harry Potter et l’ordre du phénix" />
              </OfferNameContainer>
            </Row>
            {['Films à l’affiche', '14 avril 2024'].map((subtitle, index) => (
              <Body
                key={index}
                ellipsizeMode="tail"
                numberOfLines={1}
                testID="native-category-value">
                {subtitle}
              </Body>
            ))}
            <TypoDS.BodyAccentS>120€</TypoDS.BodyAccentS>
          </Column>
        </Container>
      ),
    },
  },
]

const Template: VariantsStory<typeof HorizontalTile> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={HorizontalTile} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'HorizontalTile'
