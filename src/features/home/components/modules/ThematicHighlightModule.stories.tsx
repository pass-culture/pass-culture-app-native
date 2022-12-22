import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import mockDate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/signup/SetBirthday/utils/fixtures'

import { ThematicHighlightModule } from './ThematicHighlightModule'

mockDate.set(CURRENT_DATE)

export default {
  title: 'Features/Home/ThematicHighlightModule',
  component: ThematicHighlightModule,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof ThematicHighlightModule>

const Template: ComponentStory<typeof ThematicHighlightModule> = (props) => (
  <ThematicHighlightModule {...props} />
)

const defaultArgs = {
  displayedTitle: 'Lorem ipsum',
  displayedSubtitle: 'Dolor sit amet',
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  beginningDate: new Date('2022-12-21'),
  endingDate: new Date('2023-01-01'),
  thematicHomeEntryId: '351351',
}

export const Default = Template.bind({})
Default.args = defaultArgs

export const OneDayHighlight = Template.bind({})
OneDayHighlight.args = {
  ...defaultArgs,
  beginningDate: new Date('2022-12-21'),
  endingDate: new Date('2022-12-21'),
}
