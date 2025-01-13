import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { ChronicleCard } from 'features/chronicle/components/ChronicleCard/ChronicleCard'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof ChronicleCard> = {
  title: 'ui/ChronicleCard',
  component: ChronicleCard,
}
export default meta

const baseProps = {
  title: 'Olivier, 15 ans',
  subtitle: 'Membre du book club',
  description:
    'Pour moi, cette biographie n’est pas comme une autre. Cela concerne le créateur de Star Wars, le premier film...',
  date: 'Juin 2024',
}

const variantConfig: Variants<typeof ChronicleCard> = [
  {
    label: 'ChronicleCard default',
    props: { ...baseProps },
  },
]

const Template: VariantsStory<typeof ChronicleCard> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={ChronicleCard} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ChronicleCard'
