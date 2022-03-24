import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'

export default {
  title: 'ui/CulturalSurvey',
  component: CulturalSurveyCheckbox,
} as ComponentMeta<typeof CulturalSurveyCheckbox>

const Template: ComponentStory<typeof CulturalSurveyCheckbox> = (props) => (
  <CulturalSurveyCheckbox {...props} />
)

export const Default = Template.bind({})
