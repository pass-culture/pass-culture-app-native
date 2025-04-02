import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { InteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { theme } from 'theme'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
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

const LikeTag = styled(InteractionTag).attrs(({ theme }) => ({
  Icon: <ThumbUpFilled color={theme.colors.primary} size={16} />,
  backgroundColor: theme.colors.greyLight,
}))``

const HeadlineTag = styled(InteractionTag).attrs(() => ({
  Icon: <Star size={16} />,
  backgroundColor: theme.colors.goldLight100,
}))``

const ChronicleTag = styled(InteractionTag).attrs(() => ({
  Icon: <BookClubCertification size={16} />,
  backgroundColor: theme.colors.skyBlueLight,
}))``

const variantConfig: Variants<typeof OfferTile> = [
  {
    label: 'OfferTile Default',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
  {
    label: 'OfferTile With Likes',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      interactionTag: <LikeTag label="100 j’aime" />,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
  {
    label: 'OfferTile WithChronicles',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      interactionTag: <ChronicleTag label="Reco du Book Club" />,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
  {
    label: 'OfferTile WithHeadlines',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      interactionTag: <HeadlineTag label="Reco par les lieux" />,
      offerLocation: { lat: 48.94374, lng: 2.48171 },
    },
  },
]

export const Template: VariantsStory<typeof OfferTile> = {
  name: 'OfferTile',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={OfferTile} defaultProps={{ ...props }} />
  ),
}
