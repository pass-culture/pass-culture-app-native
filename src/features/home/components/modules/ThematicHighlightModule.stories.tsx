import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import mockDate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'

import { ThematicHighlightModule } from './ThematicHighlightModule'

mockDate.set(CURRENT_DATE)

const meta: Meta<typeof ThematicHighlightModule> = {
  title: 'Features/home/ThematicHighlightModule',
  component: ThematicHighlightModule,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ThematicHighlightModule>

const defaultArgs = {
  id: 'toto',
  title: 'Lorem ipsum',
  subtitle: 'Dolor sit amet',
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  beginningDate: new Date('2022-12-21'),
  endingDate: new Date('2023-01-01'),
  thematicHomeEntryId: '351351',
  index: 0,
}

export const Default: Story = {
  render: (props) => <ThematicHighlightModule {...props} />,
  args: defaultArgs,
}

export const OneDayHighlight: Story = {
  render: (props) => <ThematicHighlightModule {...props} />,
  args: {
    ...defaultArgs,
    beginningDate: new Date('2022-12-21'),
    endingDate: new Date('2022-12-21'),
  },
}
