import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { CreditBarWithSeparator } from './CreditBarWithSeparator'

export default {
  title: 'Features/Profile/CreditBarWithSeparator',
  component: CreditBarWithSeparator,
} as ComponentMeta<typeof CreditBarWithSeparator>

const Template: ComponentStory<typeof CreditBarWithSeparator> = (props) => (
  <GreyContainer>
    <CreditBarWithSeparator {...props} />
  </GreyContainer>
)

const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(3),
}))

export const OneInThree = Template.bind({})
OneInThree.args = {
  progress: '1/3',
}

export const TwoInThree = Template.bind({})
TwoInThree.args = {
  progress: '2/3',
}

export const ThreeInThree = Template.bind({})
ThreeInThree.args = {
  progress: '3/3',
}

export const OneInTwo = Template.bind({})
OneInTwo.args = {
  progress: '1/2',
}

export const TwoInTwo = Template.bind({})
TwoInTwo.args = {
  progress: '2/2',
}
