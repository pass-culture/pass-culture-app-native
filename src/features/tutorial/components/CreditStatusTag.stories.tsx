import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CreditStatus } from 'features/tutorial/enums'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { CreditStatusTag } from './CreditStatusTag'

const meta: ComponentMeta<typeof CreditStatusTag> = {
  title: 'features/tutorial/CreditStatusTag',
  component: CreditStatusTag,
}
export default meta

const variantConfig = [
  {
    label: 'CreditStatusTag gone',
    props: { status: CreditStatus.GONE },
  },
  {
    label: 'CreditStatusTag coming',
    props: { status: CreditStatus.COMING },
  },
  {
    label: 'CreditStatusTag ongoing',
    props: { status: CreditStatus.ONGOING },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={CreditStatusTag} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'CreditStatusTag'
