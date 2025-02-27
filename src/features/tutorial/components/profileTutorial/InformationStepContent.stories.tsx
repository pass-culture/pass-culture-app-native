import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { InformationStepContent } from './InformationStepContent'

const meta: Meta<typeof InformationStepContent> = {
  title: 'features/tutorial/InformationStepContent',
  component: InformationStepContent,
}
export default meta

const Template: StoryObj<typeof InformationStepContent> = (props) => (
  <InformationStepContent {...props} />
)
export const Default = Template.bind({})
Default.args = { title: 'La veille de tes 18 ans', subtitle: 'Ton crédit est remis à 0' }
Default.storyName = 'InformationStepContent'
