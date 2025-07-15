import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { LENGTH_S } from 'ui/theme'

import { VenueTile } from './VenueTile'

const meta: Meta<typeof VenueTile> = {
  title: 'Features/home/VenueTile',
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

const props = {
  moduleId: 'module-id',
  moduleName: 'le nom du module',
  venue: { ...venuesSearchFixture.hits[0], bannerUrl: undefined },
  height: LENGTH_S,
  width: LENGTH_S * (3 / 2),
}

const variantConfig: Variants<typeof VenueTile> = [
  {
    label: 'VenueTile WithPosition',
    props: {
      ...props,
      venue: {
        ...venuesSearchFixture.hits[0],
        bannerUrl:
          'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
      },
    },
  },
  {
    label: 'VenueTile WithPosition',
    props: { ...props },
  },
]

export const Template: VariantsStory<typeof VenueTile> = {
  name: 'VenueTile',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={VenueTile} defaultProps={{ ...props }} />
  ),
}
