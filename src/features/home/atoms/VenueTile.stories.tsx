import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { mockVenues } from 'libs/algolia/mockedResponses/mockedVenues'
import { LENGTH_S } from 'ui/theme'

import { VenueTile } from './VenueTile'

export default {
  title: 'Features/Home/VenueTile',
  component: VenueTile,
} as ComponentMeta<typeof VenueTile>

const Template: ComponentStory<typeof VenueTile> = (props) => <VenueTile {...props} />

const props = {
  moduleId: 'module-id',
  moduleName: 'le nom du module',
  venue: {
    ...mockVenues.hits[0],
    bannerUrl: undefined,
  },
  userPosition: null,
  height: LENGTH_S,
  width: LENGTH_S * (3 / 2),
}

export const WithoutImage = Template.bind({})
WithoutImage.args = props

export const WithImage = Template.bind({})
WithImage.args = {
  ...props,
  venue: {
    ...mockVenues.hits[0],
    bannerUrl:
      'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  },
}

export const WithPosition = Template.bind({})
WithPosition.args = {
  ...props,
  userPosition: {
    latitude: 50,
    longitude: 51,
  },
}
