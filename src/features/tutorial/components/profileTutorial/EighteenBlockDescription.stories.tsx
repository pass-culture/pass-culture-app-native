import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { EighteenBlockDescription } from './EighteenBlockDescription'

const meta: Meta<typeof EighteenBlockDescription> = {
  title: 'features/tutorial/EighteenBlockDescription',
  component: EighteenBlockDescription,
}
export default meta

type Story = StoryObj<typeof EighteenBlockDescription>

export const Default: Story = {
  render: () => (
    <GreyContainer>
      <EighteenBlockDescription />
    </GreyContainer>
  ),
  name: 'EighteenBlockDescription',
}

Default.parameters = {
  // Todo(PC-35078) fix this story, read the associated ticket to follow the different choices offered
  storyshots: { disable: true },
}

const GreyContainer = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.greyLight,
  padding: getSpacing(3),
}))
