import type { Meta } from '@storybook/react'
import React from 'react'

import { CreditStatus } from 'features/onboarding/enums'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { CreditStatusTag } from './CreditStatusTag'

const meta: Meta<typeof CreditStatusTag> = {
  title: 'features/tutorial/CreditStatusTag',
  component: CreditStatusTag,
}
export default meta

const variantConfig: Variants<typeof CreditStatusTag> = [
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

export const Template: VariantsStory<typeof CreditStatusTag> = {
  name: 'CreditStatusTag',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={CreditStatusTag}
      defaultProps={{ ...props }}
    />
  ),
}
