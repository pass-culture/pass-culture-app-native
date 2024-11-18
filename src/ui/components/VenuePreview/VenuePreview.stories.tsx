import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { getSpacing } from 'ui/theme'

import { VenuePreview } from './VenuePreview'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

const meta: ComponentMeta<typeof VenuePreview> = {
  title: 'ui/VenuePreview',
  component: VenuePreview,
}
export default meta

const baseProps = {
  venueName: offerResponseSnap.venue.name,
  address: offerResponseSnap.venue.address ?? '',
  imageHeight: VENUE_THUMBNAIL_SIZE,
  imageWidth: VENUE_THUMBNAIL_SIZE,
}

const variantConfig = [
  {
    label: 'VenuePreview default',
    props: {
      ...baseProps,
      bannerUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    },
  },
  {
    label: 'VenuePreview with arrow',
    props: {
      ...baseProps,
      withRightArrow: true,
      bannerUrl:
        'https://storage.googleapis.com/passculture-metier-ehp-testing-assets-fine-grained/assets/venue_default_images/krists-luhaers-AtPWnYNDJnM-unsplash.png',
    },
  },
  {
    label: 'VenuePreview without image',
    props: { ...baseProps, withRightArrow: true, bannerUrl: undefined },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={VenuePreview} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'VenuePreview'
