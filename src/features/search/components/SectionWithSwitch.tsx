import React from 'react'

import { FilterSwitch, InlineSection, TitleWithCount } from 'features/search/atoms'

interface Props {
  active?: boolean
  title: string
  subtitle?: string
  toggle?: () => void
}

export const SectionWithSwitch: React.FC<Props> = (props: Props) => {
  const { title, subtitle, active = false, toggle = () => null } = props
  return (
    <InlineSection title={<TitleWithCount title={title} count={+active} />} subtitle={subtitle}>
      <FilterSwitch active={active} toggle={toggle} />
    </InlineSection>
  )
}
