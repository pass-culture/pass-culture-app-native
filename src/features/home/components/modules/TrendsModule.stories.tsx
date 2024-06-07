import { ComponentMeta, StoryObj } from '@storybook/react'

import { TrendsModule } from './TrendsModule'

const meta: ComponentMeta<typeof TrendsModule> = {
  title: 'features/home/TrendsModule',
  component: TrendsModule,
}

export default meta

type Story = StoryObj<typeof TrendsModule>

export const Default: Story = {}
