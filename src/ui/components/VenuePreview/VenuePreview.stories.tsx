import type { Meta } from '@storybook/react'
import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { getSpacing } from 'ui/theme'

import { VenuePreview } from './VenuePreview'

const VENUE_THUMBNAIL_SIZE = getSpacing(14)

const meta: Meta<typeof VenuePreview> = {
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

const variantConfig: Variants<typeof VenuePreview> = [
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

export const Template: VariantsStory<typeof VenuePreview> = {
  name: 'VenuePreview',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={VenuePreview} defaultProps={props} />
  ),
}
