import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
import { LENGTH_S } from 'ui/theme'

import { VenueTile } from './VenueTile'

const meta: ComponentMeta<typeof VenueTile> = {
  title: 'Features/Home/VenueTile',
  component: VenueTile,
  decorators: [
    (Story) => (
      <ReactQueryClientProvider>
        <NavigationContainer>
          <Story />
        </NavigationContainer>
      </ReactQueryClientProvider>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof VenueTile> = (props) => <VenueTile {...props} />

const props = {
  moduleId: 'module-id',
  moduleName: 'le nom du module',
  venue: {
    ...venuesSearchFixture.hits[0],
    bannerUrl: undefined,
  },
  userLocation: null,
  height: LENGTH_S,
  width: LENGTH_S * (3 / 2),
}

// TODO(PC-17931): Fix this stories
const WithoutImage = Template.bind({})
WithoutImage.args = props

// TODO(PC-17931): Fix this stories
const WithImage = Template.bind({})
WithImage.args = {
  ...props,
  venue: {
    ...venuesSearchFixture.hits[0],
    bannerUrl:
      'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  },
}

// TODO(PC-17931): Fix this stories
const WithPosition = Template.bind({})
WithPosition.args = {
  ...props,
  userLocation: {
    latitude: 50,
    longitude: 51,
  },
}
