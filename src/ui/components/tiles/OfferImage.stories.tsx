import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { OfferImage } from './OfferImage'

// @ts-ignore import is unresolved, this commit is temporary
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/mocks/react-query'

const meta: ComponentMeta<typeof OfferImage> = {
  title: 'ui/tiles/OfferImage',
  component: OfferImage,
  argTypes: {
    categoryId: selectArgTypeFromObject(CategoryIdEnum),
  },
  decorators: [useQueryDecorator],
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
    label: 'Tall OfferImage',
    props: { size: 'tall' },
  },
  {
    label: 'OfferImage withImage',
    props: {
      imageUrl:
        'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
    },
  },
]

const Template: VariantsStory<typeof OfferImage> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={OfferImage} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'OfferImage'
