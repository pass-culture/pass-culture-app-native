import { NavigationContainer } from '@react-navigation/native'
import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { getSpacing } from 'ui/theme'

import { Tooltip } from './Tooltip'

const TOOLTIP_WIDTH = getSpacing(58)

const meta: Meta<typeof Tooltip> = {
  title: 'ui/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: StoryObj<typeof Tooltip> = (props) => <Tooltip {...props} />

//TODO(PC-28526): Fix this stories
const Default = Template.bind({})
Default.args = {
  label: 'Configure ta position et découvre les offres dans la zone géographique de ton choix.',
  isVisible: true,
  style: { width: TOOLTIP_WIDTH },
}
