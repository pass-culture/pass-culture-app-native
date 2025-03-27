import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Tag } from 'ui/components/Tag/Tag'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { getSpacing } from 'ui/theme'

import { OfferTile } from './OfferTile'

const meta: ComponentMeta<typeof OfferTile> = {
  title: 'ui/tiles/OfferTile',
  component: OfferTile,
  decorators: [
    (Story, { args }) => (
      <NavigationContainer>
        <View style={{ width: args.width }}>{Story()}</View>
      </NavigationContainer>
    ),
  ],
}

export default meta

const CustomThumbUp = styled(ThumbUpFilled).attrs(({ theme }) => ({
  size: getSpacing(4),
  color: theme.colors.primary,
}))``

const LikeTag = styled(Tag).attrs(() => ({
  Icon: CustomThumbUp,
}))(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const Template: ComponentStory<typeof OfferTile> = (props) => <OfferTile {...props} />

export const Default = Template.bind({})
Default.args = {
  date: 'le 18 juin 2024',
  name: 'The Fall Guy',
  price: 'dès 15,60\u00a0€',
  categoryLabel: 'Cinéma',
  width: 200,
  height: 300,
  offerLocation: { lat: 48.94374, lng: 2.48171 },
}

export const WithTags = Template.bind({})
WithTags.args = {
  date: 'le 18 juin 2024',
  name: 'The Fall Guy',
  price: 'dès 15,60\u00a0€',
  categoryLabel: 'Cinéma',
  width: 200,
  height: 300,
  interactionTag: <LikeTag label="100" />,
  offerLocation: { lat: 48.94374, lng: 2.48171 },
}
