import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'

import { TrendsModule } from './TrendsModule'

const meta: ComponentMeta<typeof TrendsModule> = {
  title: 'features/home/TrendsModule',
  component: TrendsModule,
}

export default meta

const Template: ComponentStory<typeof TrendsModule> = (props) => <TrendsModule {...props} />

export const Default = Template.bind({})
Default.args = formattedTrendsModule