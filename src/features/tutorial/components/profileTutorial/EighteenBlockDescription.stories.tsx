import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { EighteenBlockDescription } from './EighteenBlockDescription'

const meta: ComponentMeta<typeof EighteenBlockDescription> = {
  title: 'features/tutorial/EighteenBlockDescription',
  component: EighteenBlockDescription,
}
export default meta

const Template: ComponentStory<typeof EighteenBlockDescription> = () => (
  <GreyContainer>
    <EighteenBlockDescription />
  </GreyContainer>
)

// Todo(PC-35078) fix this story, read the associated ticket to follow the different choices offered
const Default = Template.bind({})
Default.storyName = 'EighteenBlockDescription'

const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(3),
}))
