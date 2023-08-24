import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { CreditProgressBarSmallWithSeparator } from './CreditProgressBarSmallWithSeparator'

export default {
  title: 'Features/Profile/CreditProgressBarSmallWithSeparator',
  component: CreditProgressBarSmallWithSeparator,
} as ComponentMeta<typeof CreditProgressBarSmallWithSeparator>

const Template: ComponentStory<typeof CreditProgressBarSmallWithSeparator> = (props) => (
  <GreyContainer>
    <CreditProgressBarSmallWithSeparator {...props} />
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
