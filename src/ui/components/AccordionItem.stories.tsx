import { action } from '@storybook/addon-actions'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Typo } from 'ui/theme'

import { AccordionItem } from './AccordionItem'

export default {
  title: 'ui/AccordionItem',
  component: AccordionItem,
} as ComponentMeta<typeof AccordionItem>

const Template: ComponentStory<typeof AccordionItem> = (props) => <AccordionItem {...props} />
const children = 'children'

export const Close = Template.bind({})
Close.args = {
  title: 'My accordion item',
  children: <Typo.Body>{children}</Typo.Body>,
}

export const Open = Template.bind({})
Open.args = {
  title: 'My accordion item',
  children: <Typo.Body>{children}</Typo.Body>,
  defaultOpen: true,
}

export const WithActiveSwitch = Template.bind({})
WithActiveSwitch.args = {
  title: 'Accordion item with switch',
  children: <Typo.Body>{children}</Typo.Body>,
  switchProps: {
    active: true,
    toggle: action('toggle'),
  },
}

export const WithDisabledActiveSwitch = Template.bind({})
WithDisabledActiveSwitch.args = {
  title: 'Accordion item with switch',
  children: <Typo.Body>{children}</Typo.Body>,
  switchProps: {
    active: true,
    disabled: true,
    toggle: action('toggle'),
  },
}
