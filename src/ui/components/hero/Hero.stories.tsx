import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum, VenueTypeCodeKey } from 'api/gen'

import { Hero } from './Hero'

export default {
  title: 'ui/Hero',
  component: Hero,
} as ComponentMeta<typeof Hero>

const Template: ComponentStory<typeof Hero> = (props) => <Hero {...props} />

export const Offer = Template.bind({})
Offer.args = {
  imageUrl: undefined,
  type: 'offer',
  categoryId: CategoryIdEnum.CINEMA,
}

export const Venue = Template.bind({})
Venue.args = {
  imageUrl: undefined,
  type: 'venue',
  venueType: VenueTypeCodeKey.ARTISTIC_COURSE,
}

export const VenueWithImage = Template.bind({})
VenueWithImage.args = {
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  type: 'venue',
  venueType: VenueTypeCodeKey.ARTISTIC_COURSE,
}

export const VenueWithBrokenImage = Template.bind({})
VenueWithBrokenImage.args = {
  imageUrl: "ceci est un lien d'image qui n'existe pas",
  type: 'venue',
  venueType: VenueTypeCodeKey.ARTISTIC_COURSE,
}
