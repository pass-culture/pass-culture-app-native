import { StoryObj, Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { UnderageBlockDescription } from './UnderageBlockDescription'

const meta: Meta<typeof UnderageBlockDescription> = {
  title: 'features/tutorial/UnderageBlockDescription',
  component: UnderageBlockDescription,
}
export default meta

const Template: StoryObj<typeof UnderageBlockDescription> = () => (
  <GreyContainer>
    <UnderageBlockDescription />
  </GreyContainer>
)
export const Default = Template.bind({})
Default.storyName = 'UnderageBlockDescription'

const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(3),
}))
