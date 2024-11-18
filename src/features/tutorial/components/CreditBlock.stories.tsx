import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CreditStatus } from 'features/tutorial/enums'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { TypoDS } from 'ui/theme'

import { CreditBlock } from './CreditBlock'

const meta: ComponentMeta<typeof CreditBlock> = {
  title: 'features/tutorial/CreditBlock',
  component: CreditBlock,
}
export default meta

const Text = <TypoDS.BodyAccentXs>Tu auras deux ans pour utiliser tes 300€</TypoDS.BodyAccentXs>

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={CreditBlock} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'CreditBlock'
