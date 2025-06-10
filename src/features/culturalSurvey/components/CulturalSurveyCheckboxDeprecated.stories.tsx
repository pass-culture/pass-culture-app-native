import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { CulturalSurveyCheckboxDeprecated } from 'features/culturalSurvey/components/CulturalSurveyCheckboxDeprecated'
import { culturalSurveyIcons } from 'ui/svg/icons/bicolor/exports/culturalSurveyIcons'

const meta: Meta<typeof CulturalSurveyCheckboxDeprecated> = {
  title: 'Features/culturalSurvey/CulturalSurveyCheckboxDeprecated',
  component: CulturalSurveyCheckboxDeprecated,
}
export default meta

type Story = StoryObj<typeof CulturalSurveyCheckboxDeprecated>

export const Default: Story = {
  render: (props) => <CulturalSurveyCheckboxDeprecated {...props} />,
  args: {
    title: 'Visité un musée,',
    subtitle: 'une piscine gonflable',
    icon: culturalSurveyIcons.Museum,
    selected: false,
  },
  name: 'CulturalSurveyCheckboxDeprecated',
}
