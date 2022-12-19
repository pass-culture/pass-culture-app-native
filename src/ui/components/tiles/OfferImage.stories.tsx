import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'
import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'

import { OfferImage } from './OfferImage'

// @ts-ignore import is unresolved, this commit is temporary
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/mocks/react-query'

export default {
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
} as ComponentMeta<typeof OfferImage>

const Template: ComponentStory<typeof OfferImage> = (props) => <OfferImage {...props} />

export const Default = Template.bind({})
Default.args = {}

export const Tall = Template.bind({})
Tall.args = {
  size: 'tall',
}

export const WithImage = Template.bind({})
WithImage.args = {
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
}
