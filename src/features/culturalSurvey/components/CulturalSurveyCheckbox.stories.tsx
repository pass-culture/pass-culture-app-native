import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { culturalSurveyIcons } from 'ui/svg/icons/bicolor/exports/culturalSurveyIcons'

const meta: Meta<typeof CulturalSurveyCheckbox> = {
  title: 'Features/culturalSurvey/CulturalSurveyCheckbox',
  component: CulturalSurveyCheckbox,
}
export default meta

type Story = StoryObj<typeof CulturalSurveyCheckbox>

export const Default: Story = {
  render: (props) => <CulturalSurveyCheckbox {...props} />,
  args: {
    title: 'Visité un musée,',
    subtitle: 'une piscine gonflable',
    icon: culturalSurveyIcons.Museum,
    selected: false,
  },
  name: 'CulturalSurveyCheckbox',
}
