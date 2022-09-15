import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum, VenueTypeCodeKey } from 'api/gen'

import { Hero } from './Hero'

// @ts-ignore import is unresolved, this commit is temporary
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/__mocks__/react-query'

export default {
  title: 'ui/Hero',
  component: Hero,
  decorators: [useQueryDecorator],
  parameters: {
    useQuery: {
      settings: { enableFrontImageResizing: false },
    },
  },
} as ComponentMeta<typeof Hero>

const Template: ComponentStory<typeof Hero> = (props) => <Hero {...props} />

export const Offer = Template.bind({})
Offer.args = {
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  type: 'offer',
  categoryId: CategoryIdEnum.CINEMA,
}

export const OfferWithoutImage = Template.bind({})
OfferWithoutImage.args = {
  imageUrl: undefined,
  type: 'offer',
  categoryId: CategoryIdEnum.CINEMA,
}

export const OfferWithBrokenImage = Template.bind({})
OfferWithBrokenImage.args = {
  imageUrl: 'this is an image link that does not exist',
  type: 'offer',
  categoryId: CategoryIdEnum.CINEMA,
}

export const Venue = Template.bind({})
Venue.args = {
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  type: 'venue',
  venueType: VenueTypeCodeKey.ARTISTIC_COURSE,
}

export const VenueWithoutImage = Template.bind({})
VenueWithoutImage.args = {
  imageUrl: undefined,
  type: 'venue',
  venueType: VenueTypeCodeKey.ARTISTIC_COURSE,
}

export const VenueWithBrokenImage = Template.bind({})
VenueWithBrokenImage.args = {
  imageUrl: 'this is an image link that does not exist',
  type: 'venue',
  venueType: VenueTypeCodeKey.ARTISTIC_COURSE,
}
