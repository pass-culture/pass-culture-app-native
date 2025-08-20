// @ts-ignore import is unresolved
// eslint-disable-next-line import/no-unresolved

import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import { ContentTypes } from 'libs/contentful/types'
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
  {
    label: 'TrendsModule with scroll view',
    props: {
      ...formattedTrendsModule,
      items: [
        ...formattedTrendsModule.items,
        {
          homeEntryId: '7qcfqY5zFesLVO5fMb4cqm',
          id: '16ZgVwnOXvVc0N8ko9Kius',
          image: {
            uri: 'https://images.ctfassets.net/2bg01iqy0isv/635psakQQwLtNuOFcf1jx2/5d779586de44d247145c8808d48a91ed/recos.png',
          },
          title: 'Tendance 4',
          type: ContentTypes.TREND_BLOCK,
        },
      ],
    },
  },
]

export const Template: VariantsStory<typeof TrendsModule> = {
  name: 'TrendsModule',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={TrendsModule} defaultProps={props} />
  ),
}
