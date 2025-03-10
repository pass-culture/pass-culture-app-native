import type { Meta } from '@storybook/react'
import React from 'react'

import { BottomBanner } from './BottomBanner'

const meta: Meta<typeof BottomBanner> = {
  title: 'features/offer/BottomBanner',
  component: BottomBanner,
}
export default meta

export const Default = (props: React.ComponentProps<typeof BottomBanner>) => (
  <BottomBanner {...props} />
)

Default.args = {
  text: 'Tu ne peux pas réserver cette offre car tu n’es pas éligible au pass Culture.',
}
