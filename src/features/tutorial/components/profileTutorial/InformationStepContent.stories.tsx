import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { InformationStepContent } from './InformationStepContent'

const meta: ComponentMeta<typeof InformationStepContent> = {
  title: 'features/tutorial/InformationStepContent',
  component: InformationStepContent,
}
export default meta

const Template: ComponentStory<typeof InformationStepContent> = (props) => (
  <InformationStepContent {...props} />
)
export const Information = Template.bind({})
Information.args = {
  title: 'La veille de tes 18 ans',
  subtitle: 'Ton crédit est remis à 0',
}
