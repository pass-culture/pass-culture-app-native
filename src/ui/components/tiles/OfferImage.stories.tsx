import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { OfferImage } from './OfferImage'

const meta: Meta<typeof OfferImage> = {
  title: 'ui/tiles/OfferImage',
  component: OfferImage,
  argTypes: {
    categoryId: {
      options: Object.keys(CategoryIdEnum),
      mapping: CategoryIdEnum,
      control: {
        type: 'select' as const,
        labels: {},
      },
    },
  },
  parameters: {
    axe: {
      // Our images do not need alt because they are illustrative
      disabledRules: ['image-alt'],
    },
    useQuery: {
      settings: { enableFrontImageResizing: false },
    },
  },
}
export default meta

const variantConfig: Variants<typeof OfferImage> = [
  {
    label: 'OfferImage',
  },
  {
    label: 'OfferImage tall',
    props: { size: 'tall' },
  },
  {
    label: 'OfferImage with image',
    props: {
      imageUrl:
        'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
    },
  },
]

export const Template: VariantsStory<typeof OfferImage> = {
  name: 'OfferImage',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={OfferImage} defaultProps={props} />
  ),
}
