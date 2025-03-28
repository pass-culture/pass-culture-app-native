import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Tag } from 'ui/components/Tag/Tag'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

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

const LikeTag = styled(Tag).attrs(({ theme }) => ({
  Icon: <ThumbUpFilled color={theme.colors.primary} size={16} />,
}))(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
}))

const HeadlineTag = styled(Tag).attrs(() => ({
  Icon: <Star size={16} />,
}))(({ theme }) => ({
  backgroundColor: theme.colors.goldLight100,
}))

const ChronicleTag = styled(Tag).attrs(() => ({
  Icon: <BookClubCertification size={16} />,
}))(({ theme }) => ({
  backgroundColor: theme.colors.skyBlueLight,
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

export const WithLikes = Template.bind({})
WithLikes.args = {
  date: 'le 18 juin 2024',
  name: 'The Fall Guy',
  price: 'dès 15,60\u00a0€',
  categoryLabel: 'Cinéma',
  width: 200,
  height: 300,
  interactionTag: <LikeTag label="100 j’aime" />,
  offerLocation: { lat: 48.94374, lng: 2.48171 },
}

export const WithChronicles = Template.bind({})
WithChronicles.args = {
  date: 'le 18 juin 2024',
  name: 'The Fall Guy',
  price: 'dès 15,60\u00a0€',
  categoryLabel: 'Cinéma',
  width: 200,
  height: 300,
  interactionTag: <ChronicleTag label="Reco du Book Club" />,
  offerLocation: { lat: 48.94374, lng: 2.48171 },
}

export const WithHeadlines = Template.bind({})
WithHeadlines.args = {
  date: 'le 18 juin 2024',
  name: 'The Fall Guy',
  price: 'dès 15,60\u00a0€',
  categoryLabel: 'Cinéma',
  width: 200,
  height: 300,
  interactionTag: <HeadlineTag label="Reco par les lieux" />,
  offerLocation: { lat: 48.94374, lng: 2.48171 },
}
