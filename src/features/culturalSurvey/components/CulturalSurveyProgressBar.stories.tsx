import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { CulturalSurveyProgressBar } from 'features/culturalSurvey/components/CulturalSurveyProgressBar'

export default {
  title: 'Features/CulturalSurvey/CulturalSurveyProgressBar',
  component: CulturalSurveyProgressBar,
} as ComponentMeta<typeof CulturalSurveyProgressBar>

const Template: ComponentStory<typeof CulturalSurveyProgressBar> = (props) => (
  <CulturalSurveyProgressBar {...props} />
)

export const Empty = Template.bind({})
Empty.args = { progress: 0 }

export const Default = Template.bind({})
Default.args = { progress: 0.5 }

export const Full = Template.bind({})
Full.args = { progress: 1 }
