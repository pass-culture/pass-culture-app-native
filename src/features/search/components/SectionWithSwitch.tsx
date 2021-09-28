import React from 'react'

import { InlineSection, TitleWithCount } from 'features/search/atoms'
import FilterSwitch from 'ui/components/FilterSwitch'

interface Props {
  active?: boolean
  accessibilityLabel: string
  title: string
  subtitle?: string
  toggle?: () => void
}

export const SectionWithSwitch: React.FC<Props> = (props: Props) => {
  const { title, accessibilityLabel, subtitle, active = false, toggle = () => null } = props
  return (
    <InlineSection title={<TitleWithCount title={title} count={+active} />} subtitle={subtitle}>
      <FilterSwitch active={active} toggle={toggle} accessibilityLabel={accessibilityLabel} />
    </InlineSection>
  )
}
