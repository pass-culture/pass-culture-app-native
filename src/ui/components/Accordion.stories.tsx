import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import FilterSwitch from 'ui/components/FilterSwitch'
import { Typo } from 'ui/theme'

import { Accordion } from './Accordion'

const meta: ComponentMeta<typeof Accordion> = {
  title: 'ui/Accordion',
  component: Accordion,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Template: ComponentStory<typeof Accordion> = (props) => <Accordion {...props} />
const children = 'children'

export const Close = Template.bind({})
Close.args = {
  title: 'My accordion',
  children: <Typo.Body>{children}</Typo.Body>,
}

export const Open = Template.bind({})
Open.args = {
  title: 'My accordion',
  children: <Typo.Body>{children}</Typo.Body>,
  defaultOpen: true,
}

export const WithLeftComponent = Template.bind({})
WithLeftComponent.args = {
  title: 'Accordion with switch',
  children: <Typo.Body>{children}</Typo.Body>,
  leftComponent: <FilterSwitch active toggle={() => undefined} />,
}
