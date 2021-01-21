import React from 'react'

import { FilterSwitch, InlineSection } from 'features/search/atoms'

interface Props {
  active?: boolean
  title: string
  subtitle?: string
  toggle?: () => void
}

export const SectionWithSwitch: React.FC<Props> = (props: Props) => {
  const { title, subtitle, active = false, toggle = () => null } = props
  return (
    <InlineSection title={title} subtitle={subtitle}>
      <FilterSwitch active={active} toggle={toggle} />
    </InlineSection>
  )
}
