// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/mocks/react-query'

import { NavigationContainer } from '@react-navigation/native'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'

import { TrendsModule } from './TrendsModule'

const meta: Meta<typeof TrendsModule> = {
  title: 'features/home/TrendsModule',
  component: TrendsModule,
  decorators: [
    useQueryDecorator,
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
  parameters: {
    useQuery: {
      featureFlags: { get: () => ({ minimalBuildNumber: 1000000 }) },
    },
  },
}

export default meta

const Template: StoryObj<typeof TrendsModule> = (props) => <TrendsModule {...props} />
//TODO(PC-30279): Fix this stories
const Default = Template.bind({})
Default.args = formattedTrendsModule
