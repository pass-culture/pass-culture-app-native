import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { Tag } from 'ui/components/Tag/Tag'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'

import { OfferTile } from './OfferTile'

const meta: Meta<typeof OfferTile> = {
  title: 'ui/tiles/OfferTile',
  component: OfferTile,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
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

type Story = StoryObj<typeof OfferTile>

export const Default: Story = {
  args: {
    date: 'le 18 juin 2024',
    name: 'The Fall Guy',
    price: 'dès 15,60\u00a0€',
    categoryLabel: 'Cinéma',
    width: 200,
    height: 300,
    offerLocation: { lat: 48.94374, lng: 2.48171 },
  },
}

export const WithLikes = {
  name: 'WithLikes',
  args: {
    date: 'le 18 juin 2024',
    name: 'The Fall Guy',
    price: 'dès 15,60\u00a0€',
    categoryLabel: 'Cinéma',
    width: 200,
    height: 300,
    interactionTag: <LikeTag label="100 j’aime" />,
    offerLocation: { lat: 48.94374, lng: 2.48171 },
  },
}

export const WithChronicles = {
  name: 'WithChronicles',
  args: {
    date: 'le 18 juin 2024',
    name: 'The Fall Guy',
    price: 'dès 15,60\u00a0€',
    categoryLabel: 'Cinéma',
    width: 200,
    height: 300,
    interactionTag: <ChronicleTag label="Reco du Book Club" />,
    offerLocation: { lat: 48.94374, lng: 2.48171 },
  },
}

export const WithHeadlines = {
  name: 'WithHeadlines',
  args: {
    date: 'le 18 juin 2024',
    name: 'The Fall Guy',
    price: 'dès 15,60\u00a0€',
    categoryLabel: 'Cinéma',
    width: 200,
    height: 300,
    interactionTag: <HeadlineTag label="Reco par les lieux" />,
    offerLocation: { lat: 48.94374, lng: 2.48171 },
  },
}
