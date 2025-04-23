import type { Meta } from '@storybook/react'
import React from 'react'

import { CreditStatus } from 'features/onboarding/enums'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { CreditBlock } from './CreditBlock'

const meta: Meta<typeof CreditBlock> = {
  title: 'features/tutorial/CreditBlock',
  component: CreditBlock,
}
export default meta

const Text = <Typo.BodyAccentXs>Tu auras deux ans pour utiliser tes 300€</Typo.BodyAccentXs>

const variantConfig: Variants<typeof CreditBlock> = [
  {
    label: 'CreditBlock ongoing',
    props: { creditStatus: CreditStatus.ONGOING, children: Text },
  },
  {
    label: 'CreditBlock gone',
    props: { creditStatus: CreditStatus.GONE, children: Text },
  },
  {
    label: 'CreditBlock coming',
    props: { creditStatus: CreditStatus.COMING, children: Text },
  },
]

export const Template: VariantsStory<typeof CreditBlock> = {
  name: 'CreditBlock',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={CreditBlock}
      defaultProps={{ ...props }}
    />
  ),
}
