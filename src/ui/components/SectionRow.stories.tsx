import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import FilterSwitch from 'ui/components/FilterSwitch'
import { SectionRow } from 'ui/components/SectionRow'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

export default {
  title: 'ui/SectionRow',
  component: SectionRow,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
    }),
  },
} as ComponentMeta<typeof SectionRow>

const Template: ComponentStory<typeof SectionRow> = (props) => <SectionRow {...props} />

export const Navigable = Template.bind({})
Navigable.args = {
  title: 'Section row navigable',
  type: 'navigable',
}

export const NavigableWithIcon = Template.bind({})
NavigableWithIcon.args = {
  title: 'Section row navigable',
  type: 'navigable',
  icon: Email,
}

export const Clickable = Template.bind({})
Clickable.args = {
  title: 'Section row clickable',
  type: 'clickable',
}

export const ClickableWithIcon = Template.bind({})
ClickableWithIcon.args = {
  title: 'Section row clickable',
  type: 'clickable',
  icon: Email,
}

const ExampleSwitch: React.FC = () => {
  return <FilterSwitch active accessibilityLabel="Switch" toggle={() => 'do nothing'} />
}

export const ClickableWithCTA = Template.bind({})
ClickableWithCTA.args = {
  title: 'Section row clickable with CTA',
  type: 'clickable',
  icon: Email,
  cta: <ExampleSwitch />,
}
