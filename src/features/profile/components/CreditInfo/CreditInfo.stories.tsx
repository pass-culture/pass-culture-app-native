import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { beneficiaryUser } from 'fixtures/user'

import { CreditInfo } from './CreditInfo'

export default {
  title: 'Features/Profile/CreditInfo',
  component: CreditInfo,
} as ComponentMeta<typeof CreditInfo>

const Template: ComponentStory<typeof CreditInfo> = (props) => <CreditInfo {...props} />

export const AllCredit = Template.bind({})
AllCredit.args = {
  totalCredit: beneficiaryUser.domainsCredit?.all,
}
