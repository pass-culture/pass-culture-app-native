import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { getSpacing } from 'ui/theme'

import { Tooltip } from './Tooltip'

const TOOLTIP_WIDTH = getSpacing(58)

const meta: ComponentMeta<typeof Tooltip> = {
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

const Template: ComponentStory<typeof Tooltip> = (props) => <Tooltip {...props} />

export const Default = Template.bind({})
Default.args = {
  label: 'Configure ta position et découvre les offres dans la zone géographique de ton choix.',
  isVisible: true,
  style: { width: TOOLTIP_WIDTH },
}
