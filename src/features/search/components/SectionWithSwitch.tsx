import React from 'react'

import { InlineSection, TitleWithCount } from 'features/search/atoms'

import FilterSwitch from '../../../ui/components/FilterSwitch'

interface Props {
  active?: boolean
  title: string
  subtitle?: string
  toggle?: () => void
  testID?: string
}

export const SectionWithSwitch: React.FC<Props> = (props: Props) => {
  const { title, subtitle, active = false, toggle = () => null, testID } = props
  return (
    <InlineSection
      title={<TitleWithCount title={title} count={+active} />}
      subtitle={subtitle}
      testID={testID}>
      <FilterSwitch active={active} toggle={toggle} />
    </InlineSection>
  )
}
