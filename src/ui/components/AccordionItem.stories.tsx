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
