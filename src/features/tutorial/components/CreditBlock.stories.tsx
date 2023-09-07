import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CreditStatus } from 'features/tutorial/enums'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { CreditBlock } from './CreditBlock'

const meta: ComponentMeta<typeof CreditBlock> = {
  title: 'features/tutorial/CreditBlock',
  component: CreditBlock,
}
export default meta

const Template: ComponentStory<typeof CreditBlock> = (props) => (
  <CreditBlock {...props}>
    <Typo.Caption>Tu auras deux ans pour utiliser tes 300€</Typo.Caption>
  </CreditBlock>
)

export const Ongoing = Template.bind({})
Ongoing.args = {
  creditStatus: CreditStatus.ONGOING,
}
export const Gone = Template.bind({})
Gone.args = {
  creditStatus: CreditStatus.GONE,
}
export const Coming = Template.bind({})
Coming.args = {
  creditStatus: CreditStatus.COMING,
}

export const Animated = Template.bind({})
Animated.args = {
  creditStatus: CreditStatus.ONGOING,
  animated: true,
}
