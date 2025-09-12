import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { HorizontalOfferTile } from './HorizontalOfferTile'

const meta: Meta<typeof HorizontalOfferTile> = {
  title: 'ui/tiles/HorizontalOfferTile',
  component: HorizontalOfferTile,
}
export default meta

const analyticsParams: OfferAnalyticsParams = {
  from: 'searchresults',
  query: '',
  index: 0,
  searchId: '539b285e',
}

const comingSoonOffer = {
  ...mockedAlgoliaResponse.hits[0],
  offer: {
    ...mockedAlgoliaResponse.hits[0].offer,
    bookingAllowedDatetime: 9753886400,
  },
}

const variantConfig: Variants<typeof HorizontalOfferTile> = [
  {
    label: 'HorizontalOfferTile Default',
    props: {
      offer: mockedAlgoliaResponse.hits[0],
      analyticsParams: analyticsParams,
    },
  },
  {
    label: 'HorizontalOfferTile with coming soon offer',
    props: {
      offer: comingSoonOffer,
      analyticsParams: analyticsParams,
    },
  },
]

export const Template: VariantsStory<typeof HorizontalOfferTile> = {
  name: 'HorizontalOfferTile',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={HorizontalOfferTile}
      defaultProps={{ ...props }}
    />
  ),
}
