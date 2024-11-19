import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BasicAccessibilityInfo } from './BasicAccessibilityInfo'

const meta: ComponentMeta<typeof BasicAccessibilityInfo> = {
  title: 'ui/accessibility/BasicAccessibilityInfo',
  component: BasicAccessibilityInfo,
}
export default meta

const Template: ComponentStory<typeof BasicAccessibilityInfo> = (props) => (
  <BasicAccessibilityInfo {...props} />
)
export const Default = Template.bind({})
Default.storyName = 'BasicAccessibilityInfo'
Default.args = {
  accessibility: {
    audioDisability: false,
    mentalDisability: false,
    motorDisability: true,
    visualDisability: true,
  },
}
