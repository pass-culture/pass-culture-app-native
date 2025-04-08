// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved

import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { TrendsModule } from './TrendsModule'

const meta: Meta<typeof TrendsModule> = {
  title: 'features/home/TrendsModule',
  component: TrendsModule,
  decorators: [
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

const variantConfig: Variants<typeof TrendsModule> = [
  {
    label: 'TrendsModule with domain credit V3',
    props: { ...formattedTrendsModule },
  },
]

export const Template: VariantsStory<typeof TrendsModule> = {
  name: 'TrendsModule',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={TrendsModule} defaultProps={props} />
  ),
}
