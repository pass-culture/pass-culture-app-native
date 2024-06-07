// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved
import { useQueryDecorator } from '/.storybook/mocks/react-query'

import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'

import { TrendsModule } from './TrendsModule'

const meta: ComponentMeta<typeof TrendsModule> = {
  title: 'features/home/TrendsModule',
  component: TrendsModule,
  decorators: [useQueryDecorator],
  parameters: {
    useQuery: {
      featureFlags: { get: () => ({ minimalBuildNumber: 1000000 }) },
    },
  },
}

export default meta

const Template: ComponentStory<typeof TrendsModule> = (props) => <TrendsModule {...props} />

export const Default = Template.bind({})
Default.args = formattedTrendsModule
