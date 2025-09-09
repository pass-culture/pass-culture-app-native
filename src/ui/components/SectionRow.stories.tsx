import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { SectionRow } from 'ui/components/SectionRow'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

const meta: Meta<typeof SectionRow> = {
  title: 'ui/sections/SectionRow',
  component: SectionRow,
  argTypes: {
    icon: {
      options: ['Email', 'EditPen'],
      mapping: {
        Email,
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
    props: { title: 'Section row navigable', type: 'navigable', icon: Email },
  },
  {
    label: 'SectionRow Clickable',
    props: { title: 'Section row clickable', type: 'clickable' },
  },
  {
    label: 'SectionRow ClickableWithIcon',
    props: { title: 'Section row clickable', type: 'clickable', icon: Email },
  },
]

export const Template: VariantsStory<typeof SectionRow> = {
  name: 'SectionRow',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={SectionRow} defaultProps={props} />
  ),
}
