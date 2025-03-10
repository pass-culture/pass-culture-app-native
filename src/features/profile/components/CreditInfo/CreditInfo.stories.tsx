import type { Meta } from '@storybook/react'
import React from 'react'

import { beneficiaryUser } from 'fixtures/user'
import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'

import { CreditInfo } from './CreditInfo'

export default {
  title: 'Features/Profile/CreditInfo',
  component: CreditInfo,
} as Meta<typeof CreditInfo>

const variantConfig: Variants<typeof CreditInfo> = [
  {
    label: 'CreditInfo',
    props: {
      totalCredit: beneficiaryUser.domainsCredit?.all,
    },
  },
]

const Template = (args: React.ComponentProps<typeof CreditInfo>) => (
  <VariantsTemplate variants={variantConfig} Component={CreditInfo} defaultProps={args} />
)

Template.parameters = {
  // Todo(PC-35078) fix this story, read the associated ticket to follow the different choices offered
  storyshots: { disable: true },
}

export const AllVariants = Template.bind({})
