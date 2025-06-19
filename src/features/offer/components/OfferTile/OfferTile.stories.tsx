import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { Tag } from 'ui/components/Tag/Tag'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { BookClubCertification } from 'ui/svg/BookClubCertification'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { ThumbUpFilled } from 'ui/svg/icons/ThumbUpFilled'
import { Star } from 'ui/svg/Star'
import { getSpacing } from 'ui/theme'

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

const ComingSoonTag = styled(Tag).attrs(({ theme }) => ({
  Icon: <ClockFilled color={theme.designSystem.color.icon.warning} size={16} />,
  backgroundColor: theme.designSystem.color.background.warning,
  paddingHorizontal: getSpacing(1),
}))``

const LikeTag = styled(Tag).attrs(({ theme }) => ({
  Icon: <ThumbUpFilled color={theme.designSystem.color.icon.brandPrimary} size={16} />,
  backgroundColor: theme.designSystem.color.background.subtle,
  paddingHorizontal: getSpacing(1),
}))``

const HeadlineTag = styled(Tag).attrs(({ theme }) => ({
  Icon: <Star color={theme.designSystem.color.icon.headline} size={16} />,
  backgroundColor: theme.designSystem.color.background.headline,
  paddingHorizontal: getSpacing(1),
}))``

const ChronicleTag = styled(Tag).attrs(({ theme }) => ({
  Icon: <BookClubCertification color={theme.designSystem.color.icon.bookclub} size={16} />,
  backgroundColor: theme.designSystem.color.background.bookclub,
  paddingHorizontal: getSpacing(1),
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
    label: 'OfferTile With Coming Soon',
    props: {
      date: 'le 18 juin 2024',
      name: 'The Fall Guy',
      price: 'dès 15,60\u00a0€',
      categoryLabel: 'Cinéma',
      width: 200,
      height: 300,
      interactionTag: <ComingSoonTag label="Bientôt dispo" />,
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
