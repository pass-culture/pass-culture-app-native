import React from 'react'

import { FilterSwitch } from '../atoms/FilterSwitch'
import { InlineSection } from '../atoms/Sections'

interface Props {
  title: string
  subtitle?: string
}

export const SectionWithSwitch: React.FC<Props> = ({ title, subtitle }: Props) => (
  <InlineSection title={title} subtitle={subtitle}>
    <FilterSwitch />
  </InlineSection>
)
