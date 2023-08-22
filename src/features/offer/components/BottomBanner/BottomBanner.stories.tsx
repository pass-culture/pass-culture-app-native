import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BottomBanner } from './BottomBanner'

const meta: ComponentMeta<typeof BottomBanner> = {
  title: 'features/offer/BottomBanner',
  component: BottomBanner,
}
export default meta

export const Default: ComponentStory<typeof BottomBanner> = (props) => <BottomBanner {...props} />

Default.args = {
  text: 'Tu ne peux pas réserver cette offre car tu n’es pas éligible au pass Culture.',
}
