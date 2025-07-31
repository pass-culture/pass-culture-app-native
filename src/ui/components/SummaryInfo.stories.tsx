import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'
import { SummaryInfo } from 'ui/components/SummaryInfo'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { CalendarS } from 'ui/svg/icons/CalendarS'

const meta: Meta<typeof SummaryInfo> = {
  title: 'ui/SummaryInfo',
  component: SummaryInfo,
}
export default meta

const baseProps = {
  Icon: <CalendarS size={theme.icons.sizes.small} />,
  title: 'Info name',
}

const variantConfig: Variants<typeof SummaryInfo> = [
  {
    label: 'SummaryInfo default',
    props: baseProps,
  },
  {
    label: 'SummaryInfo with subtitle',
    props: {
      ...baseProps,
      subtitle: 'Lorem ipsum dolor sit amet consectetur. Hendrerit massa dolor blandit.',
    },
  },
]

export const Template: VariantsStory<typeof SummaryInfo> = {
  name: 'SummaryInfo',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={SummaryInfo} defaultProps={props} />
  ),
}
