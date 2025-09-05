import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { offersFixture } from 'shared/offer/offer.fixture'
import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { MarketingBlockExclusivity } from './MarketingBlockExclusivity'

const meta: Meta<typeof MarketingBlockExclusivity> = {
  title: 'features/home/MarketingBlock/MarketingBlockExclusivity',
  component: MarketingBlockExclusivity,

  parameters: {
    useQuery: {
      subcategories: PLACEHOLDER_DATA,
      featureFlags: { get: () => ({ minimalBuildNumber: 1000000 }) },
    },
  },
}
export default meta

const variantConfig: Variants<typeof MarketingBlockExclusivity> = [
  {
    label: 'MarketingBlockExclusivity default',
    props: {
      moduleId: 'moduleId',
      offer: offersFixture[0],
    },
  },
  {
    label: 'MarketingBlockExclusivity with image',
    props: {
      moduleId: 'moduleId',
      offer: offersFixture[0],
      backgroundImageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
    },
  },
]

export const Template: VariantsStory<typeof MarketingBlockExclusivity> = {
  name: 'MarketingBlockExclusivity',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={MarketingBlockExclusivity}
      defaultProps={props}
    />
  ),
  parameters: {
    chromatic: {
      viewports: [theme.breakpoints.xs, theme.breakpoints.xl],
    },
  },
}
