import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { SectionRow } from 'ui/components/SectionRow'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

const meta: Meta<typeof SectionRow> = {
  title: 'ui/sections/SectionRow',
  component: SectionRow,
  argTypes: {
    icon: {
      options: ['EmailFilled', 'EditPen'],
      mapping: {
        EmailFilled,
        EditPen,
      },
      control: {
        type: 'select',
      },
    },
  },
}
export default meta

const variantConfig: Variants<typeof SectionRow> = [
  {
    label: 'SectionRow Navigable',
    props: { title: 'Section row navigable', type: 'navigable' },
  },
  {
    label: 'SectionRow NavigableWithIcon',
    props: { title: 'Section row navigable', type: 'navigable', icon: EmailFilled },
  },
  {
    label: 'SectionRow Clickable',
    props: { title: 'Section row clickable', type: 'clickable' },
  },
  {
    label: 'SectionRow ClickableWithIcon',
    props: { title: 'Section row clickable', type: 'clickable', icon: EmailFilled },
  },
]

export const Template: VariantsStory<typeof SectionRow> = {
  name: 'SectionRow',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={SectionRow} defaultProps={props} />
  ),
}
