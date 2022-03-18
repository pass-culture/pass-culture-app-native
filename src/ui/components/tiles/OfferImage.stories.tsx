import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { OfferImage } from './OfferImage'

export default {
  title: 'ui/tiles/OfferImage',
  component: OfferImage,
} as ComponentMeta<typeof OfferImage>

const Template: ComponentStory<typeof OfferImage> = (props) => <OfferImage {...props} />

export const Default = Template.bind({})
Default.args = {}

export const WithImage = Template.bind({})
WithImage.args = {
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
}
