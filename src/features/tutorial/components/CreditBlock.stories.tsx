import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { CreditStatus } from 'features/tutorial/enums'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { TypoDS } from 'ui/theme'

import { CreditBlock } from './CreditBlock'

const meta: ComponentMeta<typeof CreditBlock> = {
  title: 'features/tutorial/CreditBlock',
  component: CreditBlock,
}
export default meta

const Text = <TypoDS.BodyAccentXs>Tu auras deux ans pour utiliser tes 300€</TypoDS.BodyAccentXs>

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

const Template: VariantsStory<typeof CreditBlock> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={CreditBlock} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'CreditBlock'
