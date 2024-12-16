// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved

import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'

import { Trend } from './Trend'

const meta: ComponentMeta<typeof Trend> = {
  title: 'features/home/Trend',
  component: Trend,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}

export default meta

const Template: ComponentStory<typeof Trend> = (props) => <Trend {...props} />

export const Default = Template.bind({})
Default.storyName = 'Trend'
Default.args = {
  ...formattedTrendsModule.items[1],
  navigateTo: { screen: 'VenueMap' },
}
