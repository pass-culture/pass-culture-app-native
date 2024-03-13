import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CategoryIdEnum } from 'api/gen'

import { Hero } from './Hero'

// @ts-ignore import is unresolved, this commit is temporary
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/mocks/react-query'

const meta: ComponentMeta<typeof Hero> = {
  title: 'ui/Hero',
  component: Hero,
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

const Template: ComponentStory<typeof Hero> = (props) => <Hero {...props} />

export const Offer = Template.bind({})
Offer.args = {
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  categoryId: CategoryIdEnum.CINEMA,
}

export const OfferWithoutImage = Template.bind({})
OfferWithoutImage.args = {
  imageUrl: undefined,
  categoryId: CategoryIdEnum.CINEMA,
}

export const OfferWithBrokenImage = Template.bind({})
OfferWithBrokenImage.args = {
  imageUrl: 'this is an image link that does not exist',
  categoryId: CategoryIdEnum.CINEMA,
}
