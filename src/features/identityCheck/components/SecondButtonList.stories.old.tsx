import type { Meta } from '@storybook/react'
import React from 'react'

import { SecondButtonList } from 'features/identityCheck/components/SecondButtonList'
import { Smartphone } from 'ui/svg/icons/Smartphone'

const meta: Meta<typeof SecondButtonList> = {
  title: 'ui/SecondButtonList',
  component: SecondButtonList,
}
export default meta

const Template = (props: React.ComponentProps<typeof SecondButtonList>) => (
  <SecondButtonList {...props} />
)

export const Default = () =>
  Template({
    label: 'test',
    navigateTo: { screen: 'Login' },
    leftIcon: Smartphone,
  })
