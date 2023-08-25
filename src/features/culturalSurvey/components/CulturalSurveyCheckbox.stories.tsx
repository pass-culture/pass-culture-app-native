import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { culturalSurveyIcons } from 'ui/svg/icons/bicolor/exports/culturalSurveyIcons'

const meta: ComponentMeta<typeof CulturalSurveyCheckbox> = {
  title: 'Features/culturalSurvey/CulturalSurveyCheckbox',
  component: CulturalSurveyCheckbox,
}
export default meta

const Template: ComponentStory<typeof CulturalSurveyCheckbox> = (props) => (
  <CulturalSurveyCheckbox {...props} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Visité un musée,',
  subtitle: 'une piscine gonflable',
  icon: culturalSurveyIcons.Museum,
}
