import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { getSpacing } from 'ui/theme'

import { HorizontalTile } from './HorizontalTile'

const meta: ComponentMeta<typeof HorizontalTile> = {
  title: 'ui/HorizontalTile',
  component: HorizontalTile,
}
export default meta

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  outlineOffset: 0,
  gap: getSpacing(4),
})

const Template: ComponentStory<typeof HorizontalTile> = (props) => (
  <Container>
    <HorizontalTile {...props} />
  </Container>
)

export const Default = Template.bind({})

const imageUrl =
  'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW'

Default.args = {
  title: 'Harry Potter et l’ordre du phénix',
  categoryId: CategoryIdEnum.CINEMA,
  imageUrl,
  distanceToOffer: '',
  subtitles: ['Séances de cinéma', '14 avril 2024'],
  price: '120€',
}

export const OnVenuePage = Template.bind({})
OnVenuePage.args = {
  title: 'Harry Potter et l’ordre du phénix',
  imageUrl,
  withRightArrow: true,
  subtitles: ['Drame', '1h30'],
}
