import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { BottomBanner } from './BottomBanner'

export default {
  title: 'features/Offer/BottomBanner',
  component: BottomBanner,
} as ComponentMeta<typeof BottomBanner>

export const Default: ComponentStory<typeof BottomBanner> = (props) => <BottomBanner {...props} />

Default.args = {
  text: 'Tu ne peux pas réserver cette offre car tu n’es pas éligible au pass Culture.',
}
