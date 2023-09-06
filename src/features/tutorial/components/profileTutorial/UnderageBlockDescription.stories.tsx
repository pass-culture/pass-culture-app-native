import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { UnderageBlockDescription } from './UnderageBlockDescription'

const meta: ComponentMeta<typeof UnderageBlockDescription> = {
  title: 'features/tutorial/UnderageBlockDescription',
  component: UnderageBlockDescription,
}
export default meta

const Template: ComponentStory<typeof UnderageBlockDescription> = () => (
  <GreyContainer>
    <UnderageBlockDescription />
  </GreyContainer>
)
export const Description = Template.bind({})

const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(3),
}))
