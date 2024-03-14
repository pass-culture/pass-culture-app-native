import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { getSpacing } from 'ui/theme'

import { VenuePreview } from './VenuePreview'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

const meta: ComponentMeta<typeof VenuePreview> = {
  title: 'ui/VenuePreview',
  component: VenuePreview,
}
export default meta

const Template: ComponentStory<typeof VenuePreview> = (props) => <VenuePreview {...props} />
export const Default = Template.bind({})
Default.args = {
  venueName: offerResponseSnap.venue.name,
  address: offerResponseSnap.venue.address ?? '',
  imageHeight: VENUE_THUMBNAIL_SIZE,
  imageWidth: VENUE_THUMBNAIL_SIZE,
  bannerUrl:
    'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
}

export const WithArrow = Template.bind({})
WithArrow.args = {
  venueName: offerResponseSnap.venue.name,
  withRightArrow: true,
  address: offerResponseSnap.venue.address ?? '',
  imageHeight: VENUE_THUMBNAIL_SIZE,
  imageWidth: VENUE_THUMBNAIL_SIZE,
  bannerUrl:
    'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
}

export const WithoutImage = Template.bind({})
WithoutImage.args = {
  venueName: offerResponseSnap.venue.name,
  withRightArrow: true,
  address: offerResponseSnap.venue.address ?? '',
  imageHeight: VENUE_THUMBNAIL_SIZE,
  imageWidth: VENUE_THUMBNAIL_SIZE,
  bannerUrl: undefined,
}
