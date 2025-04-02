import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { ReactQueryClientProvider } from 'libs/react-query/ReactQueryClientProvider'
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

type Story = StoryObj<typeof VenueTile>

const Template = (props: React.ComponentProps<typeof VenueTile>) => <VenueTile {...props} />

const props = {
  moduleId: 'module-id',
  moduleName: 'le nom du module',
  venue: {
    ...venuesSearchFixture.hits[0],
    bannerUrl: undefined,
  },
  height: LENGTH_S,
  width: LENGTH_S * (3 / 2),
}

export const WithoutImage: Story = {
  render: () => Template(props),
}

export const WithImage: Story = {
  render: () =>
    Template({
      ...props,
      venue: {
        ...venuesSearchFixture.hits[0],
        bannerUrl:
          'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
      },
    }),
}

export const WithPosition: Story = {
  render: () => Template({ ...props }),
}
