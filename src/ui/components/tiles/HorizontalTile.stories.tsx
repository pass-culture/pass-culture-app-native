import type { Meta } from '@storybook/react-vite'
import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { OfferName } from 'ui/components/tiles/OfferName'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { HorizontalTile } from './HorizontalTile'

const meta: Meta<typeof HorizontalTile> = {
  title: 'ui/tiles/HorizontalTile',
  component: HorizontalTile,
}
export default meta

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.designSystem.size.spacing.l,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
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
            {["Films à l'affiche", '14 avril 2024'].map((subtitle, index) => (
              <Body
                key={index}
                ellipsizeMode="tail"
                numberOfLines={1}
                testID="native-category-value">
                {subtitle}
              </Body>
            ))}
            <Typo.BodyAccentS>120€</Typo.BodyAccentS>
          </Column>
        </Container>
      ),
    },
  },
]

export const Template: VariantsStory<typeof HorizontalTile> = {
  name: 'HorizontalTile',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={HorizontalTile} defaultProps={props} />
  ),
}
