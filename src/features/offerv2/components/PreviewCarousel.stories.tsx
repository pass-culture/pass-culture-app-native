import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { PreviewCarousel } from './PreviewCarousel'

const meta: ComponentMeta<typeof PreviewCarousel> = {
  title: 'features/offer/PreviewCarousel',
  component: PreviewCarousel,
}
export default meta

const Template: ComponentStory<typeof PreviewCarousel> = (props) => <PreviewCarousel {...props} />
export const Carousel = Template.bind({})
Carousel.args = {
  scrollAnimationDuration: 500,
  parallaxScrollingScale: 0.9,
  parallaxScrollingOffset: 50,
  parallaxAdjacentItemScale: 0.81,
  cards: ['#56592E', '#899F9C', '#B3C680', '#5C6265', '#F5D399', '#F1F1F1'],
}
