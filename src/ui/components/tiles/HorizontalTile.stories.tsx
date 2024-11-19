import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { getSpacing, Typo } from 'ui/theme'

import { HorizontalTile } from './HorizontalTile'

const meta: ComponentMeta<typeof HorizontalTile> = {
  title: 'ui/tiles/HorizontalTile',
  component: HorizontalTile,
}
export default meta

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  outlineOffset: 0,
  gap: getSpacing(4),
})

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const Template: ComponentStory<typeof HorizontalTile> = (props) => (
  <Container>
    <HorizontalTile {...props}>
      {['Séances de cinéma', '14 avril 2024'].map((subtitle, index) => (
        <Body
          ellipsizeMode="tail"
          numberOfLines={1}
          testID="native-category-value"
          key={`${subtitle}_${index}`}>
          {subtitle}
        </Body>
      ))}
    </HorizontalTile>
  </Container>
)

export const Default = Template.bind({})
Default.storyName = 'HorizontalTile'

const imageUrl =
  'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW'

Default.args = {
  title: 'Harry Potter et l’ordre du phénix',
  categoryId: CategoryIdEnum.CINEMA,
  imageUrl,
  distanceToOffer: '',
  price: '120€',
}
