import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { CreditProgressBar } from './CreditProgressBar'

const meta: ComponentMeta<typeof CreditProgressBar> = {
  title: 'Features/Profile/CreditProgressBar',
  component: CreditProgressBar,
}
export default meta

const Template: ComponentStory<typeof CreditProgressBar> = (props) => (
  <GreyContainer>
    <CreditProgressBar {...props} />
  </GreyContainer>
)

const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(3),
}))

export const Default = Template.bind({})
Default.args = {
  progress: 0.5,
}

export const Empty = Template.bind({})
Empty.args = {
  progress: 0,
}

export const Full = Template.bind({})
Full.args = {
  progress: 1,
}

export const Small = Template.bind({})
Small.args = {
  progress: 0.5,
  height: 'small',
}
